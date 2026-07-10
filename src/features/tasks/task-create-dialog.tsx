"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { ALL_STATUSES, getStatusLabel, COMPLEXITY_OPTIONS, getComplexityLabel, moduleColorFromId, shortId } from "@/lib/utils";
import type { TaskComplexity, TaskStatus } from "@/types";
import { toast } from "sonner";
import { Link2, X, AlertTriangle, Flame, ShieldAlert, Plus } from "lucide-react";
import { CharCounter } from "@/components/shared/char-counter";
import { FIELD_LIMITS } from "@/lib/field-limits";
import { isQuickLogModule } from "@/lib/worklog";

/** Explica o que cada marcador de complexidade significa (escala de esforço). */
const COMPLEXITY_DESCRIPTIONS: Record<number, string> = {
  1: "Muito simples",
  2: "Simples",
  3: "Média",
  5: "Complexa",
  8: "Muito complexa",
};

const schema = z.object({
  title: z.string().max(FIELD_LIMITS.task.title, `O título deve ter no máximo ${FIELD_LIMITS.task.title} caracteres`).optional(),
  description: z.string().max(FIELD_LIMITS.task.description, `A descrição deve ter no máximo ${FIELD_LIMITS.task.description} caracteres`).optional(),
  projectId: z.string().optional(),
  moduleId: z.string().optional(),
  epicId: z.string().optional(),
  assigneeId: z.string().optional(),
  status: z.enum(["BACKLOG", "PLANEJADA", "BLOQUEADA", "EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA", "CANCELADA"] as const).optional(),
  complexity: z.number().optional(),
  estimatedHours: z.number().optional(),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pré-seleciona projeto/módulo (ex.: ao criar tarefa a partir de um módulo). */
  defaultProjectId?: string;
  defaultModuleId?: string;
}

export function TaskCreateDialog({ open, onOpenChange, defaultProjectId, defaultModuleId }: Props) {
  const { createTask, addDependency, tasks, getUrgentTaskForDev } = useTaskStore();
  const { projects, modules, epics, createEpic, createModule } = useProjectStore();
  const { users } = useUserStore();
  const { user } = useAuth();

  const [selectedDepIds, setSelectedDepIds] = useState<string[]>([]);
  const [depSearch, setDepSearch] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [creatingModule, setCreatingModule] = useState(false);
  // Hoje (YYYY-MM-DD) — usado como mínimo dos campos de prazo (sem datas passadas).
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "", description: "", projectId: defaultProjectId ?? "", moduleId: defaultModuleId ?? "", epicId: "",
      assigneeId: "", status: "BACKLOG", complexity: 3, estimatedHours: 8,
      dueDate: "",
    },
  });

  // Ao abrir a partir de um módulo, semeia projeto/módulo já selecionados.
  useEffect(() => {
    if (!open) return;
    if (defaultProjectId) form.setValue("projectId", defaultProjectId);
    if (defaultModuleId) form.setValue("moduleId", defaultModuleId);
  }, [open, defaultProjectId, defaultModuleId, form]);

  const projectId = useWatch({ control: form.control, name: "projectId" }) ?? "";
  const assigneeId = useWatch({ control: form.control, name: "assigneeId" }) ?? "";

  // Tarefa urgente ativa para o dev selecionado
  const existingUrgent = assigneeId ? getUrgentTaskForDev(assigneeId) : undefined;
  // Qtd de tarefas do dev que serão bloqueadas
  const willBlockCount = isUrgent && assigneeId
    ? tasks.filter((t) => t.assigneeId === assigneeId && !["CONCLUIDA", "CANCELADA"].includes(t.status)).length
    : 0;
  // Só módulos de planejamento (exclui os "andaimes" de lançamento rápido de
  // horas). Tarefas nesses andaimes ficam escondidas do Kanban/Timeline.
  const filteredModules = modules.filter((m) => m.projectId === projectId && !isQuickLogModule(m));

  const handleCreateModule = async () => {
    const name = newModuleName.trim();
    if (!name || !projectId) return;
    setCreatingModule(true);
    try {
      const mod = await createModule({ projectId, name, description: "" });
      form.setValue("moduleId", mod.id);
      form.setValue("epicId", "");
      setNewModuleName("");
      toast.success(`Módulo "${mod.name}" criado`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar o módulo.");
    } finally {
      setCreatingModule(false);
    }
  };

  // Tarefas disponíveis para serem dependências (mesmo projeto, exceto a própria)
  const availableDeps = tasks.filter(
    (t) => t.projectId === projectId && !selectedDepIds.includes(t.id)
  );
  const filteredDeps = depSearch.trim()
    ? availableDeps.filter((t) => t.title.toLowerCase().includes(depSearch.toLowerCase()))
    : availableDeps;

  const selectedDepTasks = tasks.filter((t) => selectedDepIds.includes(t.id));
  const hasPendingDeps = selectedDepTasks.some(
    (t) => t.status !== "CONCLUIDA" && t.status !== "CANCELADA"
  );

  function toggleDep(taskId: string) {
    setSelectedDepIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  }

  const onSubmit = async (data: FormData) => {
    const finalProjectId = data.projectId || "";
    // Sem fallback silencioso de módulo: toda tarefa PRECISA de um módulo de
    // planejamento escolhido explicitamente (senão poderia cair num "andaime"
    // de lançamento rápido e sumir do Kanban/Timeline).
    const finalModuleId = data.moduleId || "";
    const finalAssigneeId = data.assigneeId || users[0]?.id || user?.id || "";

    if (!finalProjectId) {
      toast.error("Selecione um projeto para a tarefa.");
      return;
    }
    if (!finalModuleId) {
      toast.error("Toda tarefa precisa de um módulo. Selecione (ou crie) um módulo para continuar.");
      return;
    }
    if (!finalAssigneeId) {
      toast.error("Selecione um responsável para a tarefa.");
      return;
    }

    // Epic virou interno: toda tarefa é anexada a um epic "guarda-chuva" do
    // módulo. Se o módulo ainda não tem nenhum, cria um automaticamente.
    let finalEpicId = epics.find((epic) => epic.moduleId === finalModuleId)?.id ?? "";
    if (!finalEpicId) {
      const mod = modules.find((m) => m.id === finalModuleId);
      const createdEpic = await createEpic({
        projectId: finalProjectId,
        moduleId: finalModuleId,
        name: mod?.name ?? "Geral",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: undefined,
        developerIds: [],
      });
      finalEpicId = createdEpic.id;
    }

    // Se há dependências pendentes, força status BLOQUEADA
    const finalStatus: TaskStatus = hasPendingDeps ? "BLOQUEADA" : ((data.status ?? "BACKLOG") as TaskStatus);

    try {
      const task = await createTask({
        ...data,
        title: data.title?.trim() || `Tarefa ${new Date().toLocaleString("pt-BR")}`,
        description: data.description?.trim() || "Tarefa criada sem descricao.",
        // dueDate vazio ("") quebra a validação ISO do backend — envia undefined.
        dueDate: data.dueDate?.trim() || undefined,
        // A Timeline (Gantt) só lista tarefas com startDate OU dueDate. Garante um
        // startDate (hoje) para que TODA tarefa criada apareça na Timeline.
        startDate: today,
        projectId: finalProjectId,
        moduleId: finalModuleId,
        epicId: finalEpicId,
        assigneeId: finalAssigneeId,
        estimatedHours: data.estimatedHours ?? 0,
        complexity: (data.complexity ?? 1) as TaskComplexity,
        status: finalStatus,
        reporterId: user?.id ?? "",
        actualHours: 0,
        order: 0,
        dependencyIds: [],
        tags: [],
        isUrgent,
        blockedReason: hasPendingDeps
          ? `Aguardando conclusão de: ${selectedDepTasks.filter((t) => t.status !== "CONCLUIDA" && t.status !== "CANCELADA").map((t) => t.title).join(", ")}`
          : undefined,
      });

      // Cria os registros de dependência
      for (const depId of selectedDepIds) {
        await addDependency({ taskId: task.id, dependsOnTaskId: depId, type: "BLOCKED_BY" });
      }

      if (isUrgent) {
        toast.warning(`Tarefa URGENTE criada — ${willBlockCount} tarefa(s) do desenvolvedor foram bloqueadas`);
      } else if (hasPendingDeps) {
        toast.warning("Tarefa criada como BLOQUEADA até que as dependências sejam concluídas");
      } else {
        toast.success("Tarefa criada com sucesso!");
      }
      onOpenChange(false);
      form.reset();
      setSelectedDepIds([]);
      setDepSearch("");
      setIsUrgent(false);
      setNewModuleName("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar a tarefa.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Nova Tarefa</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 text-sm">Título</Label>
                  <CharCounter value={field.value} max={FIELD_LIMITS.task.title} />
                </div>
                <FormControl>
                  <Input {...field} maxLength={FIELD_LIMITS.task.title} placeholder="Título da tarefa" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <Label className="text-zinc-300 text-sm">Descrição</Label>
                  <CharCounter value={field.value} max={FIELD_LIMITS.task.description} />
                </div>
                <FormControl>
                  <Textarea {...field} maxLength={FIELD_LIMITS.task.description} placeholder="Descreva o que precisa ser feito..." className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField control={form.control} name="projectId" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Projeto</Label>
                  <Select value={field.value ?? ""} items={projects.map((p) => ({ value: p.id, label: p.name }))} onValueChange={(v) => { field.onChange(v); form.setValue("moduleId", ""); form.setValue("epicId", ""); }}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {projects.map((p) => <SelectItem key={p.id} value={p.id} label={p.name}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="moduleId" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm flex items-center gap-1">
                    Módulo <span className="text-red-400">*</span>
                  </Label>
                  {!projectId ? (
                    <p className="text-[11px] text-zinc-500 py-1.5">Selecione um projeto primeiro.</p>
                  ) : filteredModules.length === 0 ? (
                    // Projeto sem módulos: libera criar um inline para poder prosseguir.
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-amber-400/90 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" /> Este projeto não tem módulos. Crie um para continuar.
                      </p>
                      <div className="flex gap-2">
                        <input
                          value={newModuleName}
                          onChange={(e) => setNewModuleName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleCreateModule(); } }}
                          maxLength={FIELD_LIMITS.module.name}
                          placeholder="Nome do novo módulo"
                          className="flex-1 min-w-0 h-8 text-xs bg-zinc-800 border border-zinc-700 rounded-md px-3 text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleCreateModule}
                          disabled={!newModuleName.trim() || creatingModule}
                          className="h-8 px-3 shrink-0 bg-violet-600 hover:bg-violet-700 text-white gap-1 text-xs disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" /> {creatingModule ? "Criando..." : "Criar módulo"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Select value={field.value ?? ""} items={filteredModules.map((m) => ({ value: m.id, label: m.name }))} onValueChange={(v) => { field.onChange(v); form.setValue("epicId", ""); }}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700/50">
                        {filteredModules.map((m) => (
                          <SelectItem key={m.id} value={m.id} label={m.name}>
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: moduleColorFromId(m.id) }} />
                            <span className="truncate">{m.name}</span>
                            <span className="ml-auto pl-2 text-[10px] font-mono text-zinc-500 shrink-0">{shortId(m.id)}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="assigneeId" render={({ field }) => (
              <FormItem>
                <Label className="text-zinc-300 text-sm">Responsável</Label>
                <Select value={field.value ?? ""} items={users.map((u) => ({ value: u.id, label: u.name }))} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-zinc-900 border-zinc-700/50">
                    {users.map((u) => <SelectItem key={u.id} value={u.id} label={u.name}>{u.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Status</Label>
                  <Select value={field.value ?? "BACKLOG"} items={ALL_STATUSES.map((s) => ({ value: s, label: getStatusLabel(s) }))} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="complexity" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Complexidade</Label>
                  <Select value={String(field.value ?? 3)} items={COMPLEXITY_OPTIONS.map((c) => ({ value: String(c), label: `${c} · ${COMPLEXITY_DESCRIPTIONS[c]}` }))} onValueChange={(v) => field.onChange(Number(v))}>
                    <FormControl>
                      <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-900 border-zinc-700/50">
                      {COMPLEXITY_OPTIONS.map((c) => (
                        <SelectItem key={c} value={String(c)} label={`${c} · ${COMPLEXITY_DESCRIPTIONS[c]}`}>
                          <span className="font-semibold tabular-nums">{c}</span>
                          <span className="text-zinc-400">· {COMPLEXITY_DESCRIPTIONS[c]}</span>
                          <span className="text-[10px] text-zinc-600">({getComplexityLabel(c)})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-zinc-600 mt-1">Esforço estimado: 1 muito simples → 8 muito complexa.</p>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="estimatedHours" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Horas Est.</Label>
                  <FormControl>
                    <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="dueDate" render={({ field }) => (
              <FormItem>
                <Label className="text-zinc-300 text-sm">Prazo (opcional)</Label>
                <FormControl>
                  <Input {...field} type="date" min={today} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            {/* Urgente */}
            <div className={`rounded-xl border p-3 transition-all cursor-pointer select-none ${
              isUrgent
                ? "bg-red-500/10 border-red-500/40"
                : "bg-zinc-800/30 border-zinc-700/40 hover:border-zinc-600/50"
            }`}
              onClick={() => setIsUrgent((v) => !v)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isUrgent ? "bg-red-500/20" : "bg-zinc-700/50"
                  }`}>
                    <Flame className={`w-4 h-4 transition-colors ${isUrgent ? "text-red-400" : "text-zinc-500"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold transition-colors ${isUrgent ? "text-red-300" : "text-zinc-300"}`}>
                      Tarefa Urgente
                    </p>
                    <p className="text-[11px] text-zinc-500">Bloqueia todas as demais tarefas do responsável</p>
                  </div>
                </div>
                {/* Toggle visual */}
                <div className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${isUrgent ? "bg-red-500" : "bg-zinc-700"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isUrgent ? "left-5" : "left-0.5"}`} />
                </div>
              </div>

              {/* Aviso de impacto */}
              {isUrgent && assigneeId && (
                <div className="mt-2.5 pt-2.5 border-t border-red-500/20">
                  {existingUrgent ? (
                    <div className="flex items-start gap-1.5 text-[11px] text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>Este dev já tem a tarefa urgente <strong>&quot;{existingUrgent.title}&quot;</strong> em andamento</span>
                    </div>
                  ) : willBlockCount > 0 ? (
                    <div className="flex items-start gap-1.5 text-[11px] text-red-300">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>{willBlockCount}</strong> tarefa{willBlockCount > 1 ? "s" : ""} do desenvolvedor serão bloqueadas até a conclusão desta</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Selecione um responsável para ver o impacto
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Dependências */}
            {projectId && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-zinc-500" />
                  <Label className="text-zinc-300 text-sm">Dependências</Label>
                  <span className="text-[10px] text-zinc-600 ml-auto">Só inicia quando essas tarefas forem concluídas</span>
                </div>

                {/* Chips das selecionadas */}
                {selectedDepTasks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDepTasks.map((dep) => (
                      <span
                        key={dep.id}
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${
                          dep.status === "CONCLUIDA"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        }`}
                      >
                        {dep.status === "CONCLUIDA" ? "✓" : "⏳"} {dep.title.length > 28 ? dep.title.slice(0, 28) + "…" : dep.title}
                        <button type="button" onClick={() => toggleDep(dep.id)} className="hover:text-red-400 ml-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Aviso quando há deps pendentes */}
                {hasPendingDeps && (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <p className="text-[11px] text-amber-300">Tarefa será criada como <strong>Bloqueada</strong> até as dependências serem concluídas</p>
                  </div>
                )}

                {/* Campo de busca + lista */}
                <div className="relative">
                  <input
                    value={depSearch}
                    onChange={(e) => setDepSearch(e.target.value)}
                    placeholder="Buscar tarefa para adicionar como dependência..."
                    className="w-full h-8 text-xs bg-zinc-800 border border-zinc-700 rounded-md px-3 text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
                {(depSearch.trim() || filteredDeps.length <= 8) && filteredDeps.length > 0 && (
                  <div className="max-h-36 overflow-y-auto border border-zinc-700/50 rounded-lg divide-y divide-zinc-800/50">
                    {filteredDeps.slice(0, 10).map((dep) => (
                      <button
                        key={dep.id}
                        type="button"
                        onClick={() => { toggleDep(dep.id); setDepSearch(""); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800/60 transition-colors text-left"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          dep.status === "CONCLUIDA" ? "bg-emerald-400" :
                          dep.status === "EM_DESENVOLVIMENTO" ? "bg-blue-400" :
                          dep.status === "BLOQUEADA" ? "bg-red-400" : "bg-zinc-500"
                        }`} />
                        <span className="flex-1 truncate">{dep.title}</span>
                        <span className="text-[10px] text-zinc-600 shrink-0">{getStatusLabel(dep.status)}</span>
                      </button>
                    ))}
                  </div>
                )}
                {availableDeps.length === 0 && (
                  <p className="text-[11px] text-zinc-600 text-center py-1">Nenhuma outra tarefa neste projeto</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => { onOpenChange(false); setSelectedDepIds([]); setDepSearch(""); }} className="text-zinc-400">Cancelar</Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-violet-600 hover:bg-violet-700 disabled:opacity-60">
                {form.formState.isSubmitting ? "Criando..." : hasPendingDeps ? "Criar como Bloqueada" : "Criar Tarefa"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
