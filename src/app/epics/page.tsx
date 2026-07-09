"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useProjectStore, useTaskStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, cn } from "@/lib/utils";
import { quickLogModuleIds } from "@/lib/worklog";
import { motion } from "@/lib/motion";
import { ChevronRight, ExternalLink, FolderKanban, Layers, ListTodo, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import Link from "@/lib/router";
import { StatusBadge } from "@/components/shared/task-badge";
import type { Epic, ProjectStatus } from "@/types";
import { z } from "zod";

const statusLabels: Record<ProjectStatus, string> = {
  ATIVO: "Ativo",
  PAUSADO: "Pausado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  NA_FILA: "Na Fila",
};

const statusColors: Record<ProjectStatus, string> = {
  ATIVO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PAUSADO: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  CONCLUIDO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CANCELADO: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
  NA_FILA: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

const epicSchema = z.object({
  projectId: z.string().optional(),
  moduleId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  developerIds: z.array(z.string()).optional(),
});

type EpicForm = z.infer<typeof epicSchema>;

export default function EpicsPage() {
  const { epics, projects, modules, createEpic, createModule } = useProjectStore();
  const { tasks } = useTaskStore();
  const { users } = useUserStore();
  const { isAdmin } = useAuth();
  // Esconde os "andaimes" criados pelo lançamento rápido de horas (timesheet).
  const quickLog = quickLogModuleIds(modules);
  const planningEpics = epics.filter((e) => !quickLog.has(e.moduleId));
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null);
  const selectedEpic = epics.find((e) => e.id === selectedEpicId) ?? null;
  const form = useForm<EpicForm>({
    defaultValues: {
      projectId: "",
      moduleId: "",
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      developerIds: [],
    },
  });
  const projectId = useWatch({ control: form.control, name: "projectId" });
  const selectedDeveloperIds = useWatch({ control: form.control, name: "developerIds" });
  const projectsWithModules = projects.filter((project) =>
    modules.some((module) => module.projectId === project.id && !quickLog.has(module.id))
  );
  const filteredModules = modules.filter(
    (module) => module.projectId === projectId && !quickLog.has(module.id)
  );
  const selectedProject = projects.find((p) => p.id === projectId);
  const projectDevelopers = users.filter((u) => selectedProject?.developerIds.includes(u.id));

  const toggleDeveloper = (userId: string) => {
    const current = form.getValues("developerIds") ?? [];
    const next = current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId];
    form.setValue("developerIds", next);
  };

  const openCreateDialog = () => {
    form.reset({
      projectId: "",
      moduleId: "",
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      developerIds: [],
    });
    setIsCreateOpen(true);
  };

  const handleCreate = async (data: EpicForm) => {
    const fallbackProject = projectsWithModules[0];
    const firstAvailableModule = modules[0];
    const finalProjectId = data.projectId || fallbackProject?.id || firstAvailableModule?.projectId || projects[0]?.id || "";
    let fallbackModule = modules.find((module) => module.projectId === finalProjectId) ?? firstAvailableModule;
    if (!fallbackModule && finalProjectId) {
      fallbackModule = await createModule({
        projectId: finalProjectId,
        name: "Modulo Geral",
        description: "Modulo criado automaticamente.",
        order: 0,
      });
    }
    const finalModuleId = data.moduleId || fallbackModule?.id || "";

    if (!finalProjectId || !finalModuleId) {
      toast.error("Cadastre ao menos um projeto com modulo para criar epics.");
      return;
    }

    try {
      await createEpic({
        ...data,
        projectId: finalProjectId,
        moduleId: finalModuleId,
        name: data.name?.trim() || `Epic ${new Date().toLocaleString("pt-BR")}`,
        description: data.description?.trim() || "Epic criado sem descricao.",
        startDate: data.startDate || new Date().toISOString().split("T")[0],
        endDate: data.endDate || undefined,
        developerIds: data.developerIds ?? [],
      });
      toast.success("Epic criado com sucesso");
      setIsCreateOpen(false);
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar o epic.");
    }
  };

  return (
    <>
      <PageHeader
        title="Epics"
        description={`${epics.length} epics em andamento`}
        actions={isAdmin ? [{ label: "Novo Epic", onClick: openCreateDialog }] : undefined}
      />
      <div className="p-6 w-full">
        {planningEpics.length === 0 ? (
          <EmptyState icon={Layers} title="Nenhum epic" description="Os epics serão exibidos aqui." />
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const projectEpics = planningEpics.filter((e) => e.projectId === project.id);
              if (projectEpics.length === 0) return null;
              return (
                <div key={project.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: project.color }} />
                    <h2 className="text-sm font-semibold text-zinc-300">{project.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projectEpics.map((epic, i) => {
                      const projectModule = modules.find((m) => m.id === epic.moduleId);
                      const epicTasks = tasks.filter((t) => t.epicId === epic.id);
                      const epicDevs = users.filter((u) => epic.developerIds?.includes(u.id));
                      return (
                        <motion.div
                          role="button"
                          tabIndex={0}
                          key={epic.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedEpicId(epic.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedEpicId(epic.id);
                            }
                          }}
                          className={cn(
                            "group w-full text-left bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5",
                            "cursor-pointer transition-all hover:border-violet-500/30 hover:bg-zinc-900/80",
                            "hover:shadow-lg hover:shadow-violet-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60",
                            selectedEpicId === epic.id && "border-violet-500/40 bg-violet-500/5"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">{epic.name}</h3>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusColors[epic.status]}`}>
                                {statusLabels[epic.status]}
                              </span>
                              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{epic.description}</p>
                            {projectModule && (
                              <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded mb-3 inline-block">{projectModule.name}</span>
                          )}
                          {epicDevs.length > 0 && (
                            <div className="flex items-center gap-1 mb-3">
                              {epicDevs.slice(0, 5).map((dev) => (
                                <div key={dev.id} title={dev.name} className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-[10px] font-semibold text-zinc-300 shrink-0 -ml-1 first:ml-0">
                                  {dev.avatar ? (
                                    <img src={dev.avatar} alt={dev.name} className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    dev.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                              ))}
                              {epicDevs.length > 5 && (
                                <span className="text-[10px] text-zinc-500 ml-1">+{epicDevs.length - 5}</span>
                              )}
                            </div>
                          )}
                          <Progress value={epic.progress} className="h-1.5 bg-zinc-800 mb-2" />
                          <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span>{epic.progress}% concluído</span>
                            <span>{epicTasks.length} tarefa{epicTasks.length !== 1 ? "s" : ""} · {formatDate(epic.startDate)} – {formatDate(epic.endDate)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Novo Epic</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="projectId" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Projeto</Label>
                    <Select
                      value={field.value || undefined}
                      onValueChange={(value) => {
                        field.onChange(value ?? "");
                        form.setValue("moduleId", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700/50">
                        {projectsWithModules.map((project) => (
                          <SelectItem key={project.id} value={project.id} label={project.name}>{project.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="moduleId" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Modulo</Label>
                    <Select value={field.value || undefined} onValueChange={(value) => field.onChange(value ?? "")} disabled={!projectId}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-zinc-300">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-900 border-zinc-700/50">
                        {filteredModules.map((module) => (
                          <SelectItem key={module.id} value={module.id} label={module.name}>{module.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Nome</Label>
                  <FormControl>
                    <Input {...field} placeholder="Nome do epic" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <Label className="text-zinc-300 text-sm">Descricao</Label>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Objetivo e escopo do epic" className="bg-zinc-800 border-zinc-700 text-zinc-100 resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Inicio</Label>
                    <FormControl>
                      <Input {...field} type="date" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem>
                    <Label className="text-zinc-300 text-sm">Prazo</Label>
                    <FormControl>
                      <Input {...field} type="date" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              {projectId && projectDevelopers.length > 0 && (
                <div>
                  <Label className="text-zinc-300 text-sm flex items-center gap-1.5 mb-2">
                    <Users className="w-3.5 h-3.5" />
                    Desenvolvedores
                  </Label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {projectDevelopers.map((dev) => {
                      const checked = (selectedDeveloperIds ?? []).includes(dev.id);
                      return (
                        <button
                          key={dev.id}
                          type="button"
                          onClick={() => toggleDeveloper(dev.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition-colors ${checked ? "border-violet-500/50 bg-violet-500/10" : "border-zinc-700/50 bg-zinc-800/50 hover:border-zinc-600"}`}
                        >
                          <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300 shrink-0">
                            {dev.avatar ? (
                              <img src={dev.avatar} alt={dev.name} className="w-7 h-7 rounded-full object-cover" />
                            ) : (
                              dev.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-zinc-200 truncate">{dev.name}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{dev.position}</p>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? "border-violet-500 bg-violet-500" : "border-zinc-600"}`}>
                            {checked && <span className="text-white text-[10px] font-bold">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-zinc-400">
                  Cancelar
                </Button>
                <Button type="button" onClick={() => void handleCreate(form.getValues())} className="bg-violet-600 hover:bg-violet-700">
                  Criar Epic
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <EpicDetailSheet
        epic={selectedEpic}
        open={!!selectedEpic}
        onOpenChange={(open) => !open && setSelectedEpicId(null)}
        projects={projects}
        modules={modules}
        tasks={tasks}
        users={users}
      />
    </>
  );
}

function EpicDetailSheet({
  epic,
  open,
  onOpenChange,
  projects,
  modules,
  tasks,
  users,
}: {
  epic: Epic | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: ReturnType<typeof useProjectStore.getState>["projects"];
  modules: ReturnType<typeof useProjectStore.getState>["modules"];
  tasks: ReturnType<typeof useTaskStore.getState>["tasks"];
  users: ReturnType<typeof useUserStore.getState>["users"];
}) {
  if (!epic) return null;

  const project = projects.find((p) => p.id === epic.projectId);
  const projectModule = modules.find((m) => m.id === epic.moduleId);
  const epicTasks = tasks.filter((t) => t.epicId === epic.id);
  const epicDevs = users.filter((u) => epic.developerIds?.includes(u.id));
  const completedTasks = epicTasks.filter((t) => t.status === "CONCLUIDA").length;
  const inProgressTasks = epicTasks.filter((t) => t.status === "EM_DESENVOLVIMENTO").length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-zinc-900 border-zinc-700/50 text-zinc-100 sm:max-w-lg overflow-y-auto">
        <SheetHeader className="border-b border-zinc-800/50 pb-4">
          <div className="flex items-start gap-3 pr-8">
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-zinc-100 text-base leading-snug">{epic.name}</SheetTitle>
              <SheetDescription className="text-zinc-500 mt-1">
                {project?.name}{projectModule ? ` · ${projectModule.name}` : ""}
              </SheetDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusColors[epic.status]}`}>
              {statusLabels[epic.status]}
            </span>
            <span className="text-xs text-zinc-500">
              {formatDate(epic.startDate)} – {formatDate(epic.endDate)}
            </span>
          </div>
        </SheetHeader>

        <div className="space-y-5 py-4">
          {epic.description && (
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Descrição</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{epic.description}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Progresso</p>
            <div className="flex items-center justify-between text-sm text-zinc-300 mb-2">
              <span>{epic.progress}% concluído</span>
              <span className="text-zinc-500">{completedTasks}/{epicTasks.length} tarefas</span>
            </div>
            <Progress value={epic.progress} className="h-2 bg-zinc-800" />
            {inProgressTasks > 0 && (
              <p className="text-xs text-violet-400 mt-2">{inProgressTasks} em desenvolvimento agora</p>
            )}
          </div>

          {epicDevs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Desenvolvedores
              </p>
              <div className="space-y-2">
                {epicDevs.map((dev) => (
                  <div key={dev.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300 shrink-0">
                      {dev.avatar ? (
                        <img src={dev.avatar} alt={dev.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        dev.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{dev.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{dev.position}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5" />
              Tarefas ({epicTasks.length})
            </p>
            {epicTasks.length === 0 ? (
              <p className="text-sm text-zinc-500 py-4 text-center border border-dashed border-zinc-700/50 rounded-lg">
                Nenhuma tarefa vinculada a este epic.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {epicTasks.map((task) => {
                  const assignee = users.find((u) => u.id === task.assigneeId);
                  return (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 hover:border-violet-500/30 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-zinc-200 truncate group-hover:text-violet-300 transition-colors">{task.title}</p>
                        {assignee && (
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{assignee.name}</p>
                        )}
                      </div>
                      <StatusBadge status={task.status} className="shrink-0 text-[10px] px-1.5 py-0" />
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 shrink-0" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800/50">
          {project && (
            <Button
              render={<Link href={`/projects/${project.id}`} className="inline-flex items-center gap-2" />}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              Ver projeto
            </Button>
          )}
          <Button
            render={<Link href="/kanban" className="inline-flex items-center gap-2" />}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir Kanban
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
