"use client";

import { useMemo, useState } from "react";
import {
  startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, format, parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "@/lib/motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, Pencil, Plus, Check, X, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { toISODate, DatePicker } from "@/components/ui/date-picker";
import { type DateRange } from "@/components/shared/period-filter";
import { cn } from "@/lib/utils";
import Link from "@/lib/router";
import type { ModuleStatus, TaskStatus } from "@/types";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const NEW = "__new__";

const moduleStatusLabels: Record<ModuleStatus, string> = {
  INICIADO: "Iniciado",
  EM_PROCESSO: "Em processo",
  CONCLUIDO: "Concluído",
};

/** Status da TAREFA no lançamento rápido (rótulo simples → status real). */
const WORK_STATUS: { value: TaskStatus; label: string }[] = [
  { value: "CONCLUIDA", label: "Concluído" },
  { value: "EM_DESENVOLVIMENTO", label: "Em andamento" },
  { value: "BACKLOG", label: "A fazer" },
];

function fmtH(h: number): string {
  return h >= 1 ? `${h.toFixed(1)}h` : `${Math.round(h * 60)}m`;
}

interface Props {
  /** Período exibido (mesmos presets/intervalo da matriz). */
  range: DateRange;
  /** Projetos ocultos (desmarcados). Vazio = todos. */
  hiddenProjects?: Set<string>;
  /** Desenvolvedores ocultos (desmarcados). Vazio = todos. */
  hiddenDevs?: Set<string>;
}

const EMPTY_SET: Set<string> = new Set();

/** Calendário de atividades (meses do período) com mapa de calor e editor de trabalho por dia. */
export function ActivityCalendar({ range, hiddenProjects = EMPTY_SET, hiddenDevs = EMPTY_SET }: Props) {
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin, user } = useAuth();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  // Ano exibido no calendário (controlador próprio). Começa no ano do período
  // filtrado, ou no ano atual. Mostra o ano inteiro — inclusive meses futuros.
  const [year, setYear] = useState<number>(() => {
    const iso = range.end || range.start;
    return iso ? Number(iso.slice(0, 4)) : currentYear;
  });

  const taskById = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);
  const projectById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const logsByDay = useMemo(() => {
    const map = new Map<string, typeof timeLogs>();
    for (const tl of timeLogs) {
      if (!isAdmin && tl.userId !== user?.id) continue;
      if (hiddenDevs.has(tl.userId)) continue;
      // Filtra pelo ANO exibido (o calendário mostra o ano inteiro).
      if (!tl.date.startsWith(`${year}-`)) continue;
      const task = taskById.get(tl.taskId);
      if (task && hiddenProjects.has(task.projectId)) continue;
      const day = tl.date.split("T")[0];
      const list = map.get(day) ?? [];
      list.push(tl);
      map.set(day, list);
    }
    return map;
  }, [timeLogs, isAdmin, user?.id, year, hiddenProjects, hiddenDevs, taskById]);

  const hoursByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const [day, logs] of logsByDay) {
      map.set(day, logs.reduce((s, l) => s + l.hours, 0));
    }
    return map;
  }, [logsByDay]);

  const maxDay = Math.max(1, ...hoursByDay.values());
  const periodTotal = [...hoursByDay.values()].reduce((a, b) => a + b, 0);
  const activeDays = hoursByDay.size;

  // Mostra o ANO inteiro (Jan→Dez), inclusive meses futuros — assim dá pra
  // clicar num dia à frente e já lançar/planejar o trabalho.
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, m) => new Date(year, m, 1)),
    [year],
  );

  const dayLogs = selectedDay ? (logsByDay.get(selectedDay) ?? []) : [];
  const dayTotal = dayLogs.reduce((s, l) => s + l.hours, 0);
  const dayDevs = new Set(dayLogs.map((l) => l.userId)).size;
  const todayIso = toISODate(new Date());

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px] items-start">
      {/* Coluna do calendário */}
      <div className="space-y-4 min-w-0">
        {/* Controlador de ano — navega para meses futuros/passados */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Button
              type="button" variant="ghost" size="icon-sm"
              onClick={() => setYear((y) => y - 1)}
              aria-label="Ano anterior"
              className="text-zinc-400 hover:text-zinc-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-base font-semibold text-zinc-100 tabular-nums w-16 text-center">{year}</span>
            <Button
              type="button" variant="ghost" size="icon-sm"
              onClick={() => setYear((y) => y + 1)}
              aria-label="Próximo ano"
              className="text-zinc-400 hover:text-zinc-100"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            {year !== currentYear && (
              <Button
                type="button" variant="ghost" size="sm"
                onClick={() => setYear(currentYear)}
                className="ml-1 h-7 text-xs text-violet-400 hover:text-violet-300"
              >
                Ano atual
              </Button>
            )}
          </div>
          <p className="text-xs text-zinc-500">
            <span className="text-zinc-300 font-medium">{periodTotal.toFixed(1)}h</span> em {activeDays} dia(s) · {year}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
          {months.map((monthDate) => {
            const monthStart = startOfMonth(monthDate);
            const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(monthDate) });
            const leadingBlanks = getDay(monthStart);
            return (
              <motion.div
                key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: monthDate.getMonth() * 0.02 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-3"
              >
                <p className="text-xs font-semibold text-zinc-300 capitalize mb-2">
                  {format(monthDate, "MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {WEEKDAYS.map((w, i) => (
                    <div key={i} className="h-4 flex items-center justify-center text-[9px] font-medium text-zinc-600">{w}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b-${i}`} className="h-9" />)}
                  {days.map((day) => {
                    const iso = toISODate(day);
                    const hours = hoursByDay.get(iso) ?? 0;
                    const has = hours > 0;
                    const devs = has ? new Set((logsByDay.get(iso) ?? []).map((l) => l.userId)).size : 0;
                    const isSel = iso === selectedDay;
                    const isTodayCell = iso === todayIso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setSelectedDay(iso)}
                        title={has ? `${fmtH(hours)} · ${devs} dev(s)` : "Sem registro — clique para adicionar"}
                        style={has && !isSel ? { background: `rgba(139, 92, 246, ${0.18 + (hours / maxDay) * 0.62})` } : undefined}
                        className={cn(
                          "relative h-9 rounded-md flex flex-col items-center justify-center transition-all cursor-pointer border border-transparent",
                          has ? "text-white" : "text-zinc-600 hover:bg-zinc-800/60",
                          isSel && "bg-violet-600 text-white ring-2 ring-violet-300 scale-[1.06] z-10 shadow-lg shadow-violet-900/40",
                          !isSel && "hover:ring-1 hover:ring-violet-400/60",
                          !isSel && isTodayCell && "border-violet-400/80",
                        )}
                      >
                        <span className={cn("text-[11px] leading-none", has || isSel ? "font-semibold" : "", isTodayCell && !isSel && "text-violet-300")}>
                          {day.getDate()}
                        </span>
                        {has && <span className="text-[8px] leading-none mt-0.5 opacity-90">{fmtH(hours)}</span>}
                        {isTodayCell && <span className="absolute -bottom-px text-[6px] uppercase tracking-wide text-violet-300/90">hoje</span>}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-2 text-[11px] text-zinc-600">
          <span>Menos</span>
          {[0.18, 0.35, 0.5, 0.65, 0.8].map((a) => (
            <span key={a} className="w-4 h-4 rounded" style={{ background: `rgba(139, 92, 246, ${a})` }} />
          ))}
          <span>Mais horas</span>
          <span className="ml-3 inline-flex items-center gap-1"><span className="w-3 h-3 rounded border border-violet-400/80" /> hoje</span>
          <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-600 ring-1 ring-violet-300" /> selecionado</span>
        </div>
      </div>

      {/* Painel lateral: detalhe + edição do dia (tudo na mesma tela) */}
      <div className="lg:sticky lg:top-4 bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 space-y-3 lg:max-h-[calc(100vh-2rem)] overflow-y-auto" data-print-hide>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-violet-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Dia selecionado</h3>
        </div>

        {/* Seletor de data preciso */}
        <DatePicker value={selectedDay ?? undefined} onChange={setSelectedDay} placeholder="Escolha uma data..." />

        {selectedDay ? (
          <div className="space-y-3 pt-1">
            <p className="text-xs text-zinc-400 capitalize">
              {format(parseISO(selectedDay), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            {dayLogs.length > 0 && (
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-violet-400" /> {dayTotal.toFixed(1)}h</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-violet-400" /> {dayDevs} dev(s)</span>
              </div>
            )}

            <div className="space-y-1.5">
              {dayLogs.map((l) => {
                const task = taskById.get(l.taskId);
                const project = task ? projectById.get(task.projectId) : null;
                const dev = userById.get(l.userId);
                return (
                  <EntryRow
                    key={l.id}
                    moduleId={task?.moduleId ?? null}
                    taskId={l.taskId}
                    dayIso={selectedDay}
                    title={task?.title ?? l.description ?? "Registro"}
                    projectName={project?.name}
                    projectColor={project?.color}
                    devName={dev?.name}
                    userId={l.userId}
                    hours={l.hours}
                  />
                );
              })}
              {dayLogs.length === 0 && (
                <p className="text-xs text-zinc-600 py-1">Nenhum registro neste dia ainda.</p>
              )}
            </div>

            <DayEditor key={selectedDay} day={selectedDay} ownerId={user?.id ?? ""} />
          </div>
        ) : (
          <p className="text-xs text-zinc-600 py-4 text-center">
            Selecione um dia no calendário (ou na data acima) para ver e editar o que foi feito.
          </p>
        )}
      </div>
    </div>
  );
}

/** Linha de um registro existente, com edição inline de nome/descrição/status do módulo. */
function EntryRow({
  moduleId, taskId, dayIso, title, projectName, projectColor, devName, userId, hours, onNavigate,
}: {
  moduleId: string | null;
  taskId: string;
  dayIso: string;
  title: string;
  projectName?: string;
  projectColor?: string;
  devName?: string;
  userId: string;
  hours: number;
  onNavigate?: () => void;
}) {
  const { modules, updateModule } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin } = useAuth();
  const moduleObj = moduleId ? modules.find((m) => m.id === moduleId) : null;
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(title);
  const [desc, setDesc] = useState(moduleObj?.description ?? "");
  const [status, setStatus] = useState<ModuleStatus>(moduleObj?.status ?? "CONCLUIDO");
  const [workDate, setWorkDate] = useState(moduleObj?.workDate ?? dayIso);
  const [hrs, setHrs] = useState(String(hours));
  const [assignedUserId, setAssignedUserId] = useState(userId);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!moduleId) return;
    const h = Number(hrs);
    if (!h || h <= 0) { toast.error("Informe as horas (maior que 0)"); return; }
    setSaving(true);
    try {
      await updateModule(moduleId, {
        name: name.trim(), description: desc.trim(), status, workDate, hours: h,
        assignedUserId: isAdmin && assignedUserId !== userId ? assignedUserId : undefined,
      });
      // INC-13: refetch só dos logs deste projeto (não de todos do tenant).
      if (moduleObj?.projectId) {
        await useTaskStore.getState().fetchTimeLogsForProject(moduleObj.projectId);
      }
      toast.success("Registro atualizado");
      setEditing(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao atualizar");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="bg-zinc-800/40 border border-violet-500/30 rounded-lg p-2.5 space-y-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="O que você fez" className="h-8 bg-zinc-950 border-zinc-700 text-sm" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descrição..." rows={2}
          className="w-full text-sm bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 outline-none focus:border-violet-500/50 resize-none" />
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wide text-zinc-500">Data</label>
            <DatePicker value={workDate} onChange={setWorkDate} className="h-8" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wide text-zinc-500">Horas</label>
            <Input type="number" min="0" step="0.25" value={hrs} onChange={(e) => setHrs(e.target.value)} className="h-8 bg-zinc-950 border-zinc-700 text-sm" />
          </div>
        </div>
        {isAdmin && (
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wide text-zinc-500">Desenvolvedor</label>
            <Select value={assignedUserId} onValueChange={(v) => v && setAssignedUserId(v)}>
              <SelectTrigger className="h-8 text-xs bg-zinc-950 border-zinc-700 w-full"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-64">
                {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={(v) => v && setStatus(v as ModuleStatus)}>
            <SelectTrigger className="h-8 text-xs bg-zinc-950 border-zinc-700 flex-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(moduleStatusLabels).map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="h-8 text-xs text-zinc-400"><X className="w-3.5 h-3.5" /></Button>
          <Button size="sm" onClick={save} disabled={saving || !name.trim()} className="h-8 text-xs bg-violet-600 hover:bg-violet-700"><Check className="w-3.5 h-3.5" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800/40 border border-zinc-800/50 rounded-lg p-2.5">
      <div className="flex items-center gap-2">
        {projectColor && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: projectColor }} />}
        <Link href={`/tasks/${taskId}`} onClick={() => onNavigate?.()} className="text-xs font-medium text-zinc-200 hover:text-violet-300 truncate flex-1">{title}</Link>
        <span className="text-[10px] text-zinc-500 shrink-0">{fmtH(hours)}</span>
        {moduleId && (
          <button type="button" onClick={() => setEditing(true)} title="Editar registro"
            className="p-1 rounded text-zinc-500 hover:text-violet-300 hover:bg-violet-500/10 shrink-0">
            <Pencil className="w-3 h-3" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
        {projectName && <span className="truncate">{projectName}</span>}
        {devName && <span className="ml-auto shrink-0">{devName.split(" ")[0]}</span>}
      </div>
    </div>
  );
}

/**
 * Formulário de lançamento de trabalho do dia (timesheet).
 * Fluxo contínuo, sem jargão de "módulo": Desenvolvedor → Projeto → O que fez →
 * Detalhes → Horas/Data → Status → Adicionar. Para EDITAR um lançamento, use o
 * lápis na linha do registro acima.
 */
function DayEditor({ day, ownerId }: { day: string; ownerId: string }) {
  const { projects, modules, epics, createProject, createModule, createEpic } = useProjectStore();
  const { createTask, logTime } = useTaskStore();
  const { users } = useUserStore();
  const { isAdmin } = useAuth();

  const [open, setOpen] = useState(false);
  const [assignedUserId, setAssignedUserId] = useState(ownerId);
  const [projChoice, setProjChoice] = useState("");
  const [newProjName, setNewProjName] = useState("");
  const [moduleChoice, setModuleChoice] = useState("");
  const [newModuleName, setNewModuleName] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [hours, setHours] = useState("");
  const [wd, setWd] = useState(day);
  const [status, setStatus] = useState<TaskStatus>("CONCLUIDA");
  const [saving, setSaving] = useState(false);

  const isNewProject = projChoice === NEW;
  // Módulos do projeto escolhido (para o seletor central de módulo).
  const projectModules = useMemo(
    () => (!projChoice || isNewProject ? [] : modules.filter((m) => m.projectId === projChoice).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))),
    [modules, projChoice, isNewProject],
  );
  // Projeto novo (ou existente sem módulos) => cria um módulo novo.
  const isNewModule = isNewProject || moduleChoice === NEW || (!!projChoice && projectModules.length === 0);
  const projectResolved = isNewProject ? newProjName.trim().length > 0 : projChoice.length > 0;
  const moduleResolved = isNewModule ? newModuleName.trim().length > 0 : moduleChoice.length > 0;
  const canSubmit = projectResolved && moduleResolved && title.trim().length > 0 && Number(hours) > 0;

  // Número estável por projeto (ordem de criação) — serve de "código" para achar fácil.
  const projectNumber = useMemo(() => {
    const m = new Map<string, number>();
    [...projects]
      .sort((a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""))
      .forEach((p, i) => m.set(p.id, i + 1));
    return m;
  }, [projects]);
  // Lista ordenada por nome para leitura/scan mais fácil no dropdown.
  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    [projects],
  );
  const selectedProject = projects.find((p) => p.id === projChoice);

  function reset() {
    setProjChoice(""); setNewProjName(""); setModuleChoice(""); setNewModuleName("");
    setTitle(""); setDesc(""); setHours(""); setWd(day); setStatus("CONCLUIDA");
    setAssignedUserId(ownerId); setOpen(false);
  }

  async function save() {
    if (!canSubmit) {
      if (!projectResolved) toast.error("Escolha (ou nomeie) o projeto");
      else if (!moduleResolved) toast.error("Escolha (ou nomeie) o módulo");
      else if (!title.trim()) toast.error("Descreva a tarefa (o que foi feito)");
      else toast.error("Informe as horas (maior que 0)");
      return;
    }
    setSaving(true);
    try {
      // 1) Projeto (cria se for novo)
      let projectId = projChoice;
      if (isNewProject) {
        const proj = await createProject({
          name: newProjName.trim(),
          description: "Criado pelo calendário.",
          status: "ATIVO",
          ownerId,
          developerIds: [],
          actualHours: 0,
          progress: 0,
          estimatedHours: 0,
          color: "#6366f1",
          startDate: day,
          endDate: null,
        } as Parameters<typeof createProject>[0]);
        projectId = proj.id;
      }

      // 2) Módulo (a "atividade do setor") — cria SEM horas se for novo.
      let moduleId = moduleChoice;
      if (isNewModule) {
        const mod = await createModule({ projectId, name: newModuleName.trim(), description: "" });
        moduleId = mod.id;
      }

      // 3) Epic interno (guarda-chuva do módulo, exigido pelo backend).
      let epicId = epics.find((e) => e.moduleId === moduleId)?.id ?? "";
      if (!epicId) {
        const modObj = modules.find((m) => m.id === moduleId);
        const ep = await createEpic({
          projectId,
          moduleId,
          name: modObj?.name ?? (newModuleName.trim() || "Geral"),
          description: "",
          startDate: day,
          endDate: undefined,
          developerIds: [],
        });
        epicId = ep.id;
      }

      // 4) Tarefa dentro do módulo.
      const assignee = isAdmin ? assignedUserId : ownerId;
      const h = Number(hours);
      const task = await createTask({
        projectId,
        moduleId,
        epicId,
        title: title.trim(),
        description: desc.trim() || title.trim(),
        status,
        complexity: 1,
        assigneeId: assignee,
        reporterId: ownerId,
        estimatedHours: 0,
        actualHours: 0,
        dependencyIds: [],
        tags: [],
        order: 0,
        isUrgent: false,
      });

      // 5) Registro de horas na tarefa.
      await logTime({
        projectId,
        taskId: task.id,
        hours: h,
        description: desc.trim() || title.trim(),
        date: wd,
        status,
      });

      const who = users.find((u) => u.id === assignee)?.name;
      toast.success(`Tarefa registrada: ${h}h em ${wd.split("-").reverse().join("/")}${isAdmin && who ? ` para ${who.split(" ")[0]}` : ""}`);
      reset();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-zinc-700 text-xs text-zinc-400 hover:text-violet-300 hover:border-violet-500/50 transition-colors">
        <Plus className="w-3.5 h-3.5" /> Adicionar tarefa neste dia
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); void save(); }}
      className="rounded-lg border border-zinc-700/60 bg-zinc-950/50 p-3 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-300">Adicionar tarefa ao módulo</p>
        <button type="button" onClick={reset} className="text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4" /></button>
      </div>

      {/* 1) Desenvolvedor (só admin pode lançar para outro) */}
      {isAdmin && (
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-zinc-500">Desenvolvedor</label>
          <Select value={assignedUserId} onValueChange={(v) => v && setAssignedUserId(v)}>
            <SelectTrigger className="h-8 w-full text-xs bg-zinc-900 border-zinc-700">
              {/* Resolve o nome a partir da lista (evita mostrar o id cru antes de abrir). */}
              <SelectValue placeholder="Selecione o desenvolvedor">
                {(value: unknown) => users.find((u) => u.id === value)?.name ?? "Selecione o desenvolvedor"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50 max-h-72">
              {users.map((u) => <SelectItem key={u.id} value={u.id} label={u.name}>{u.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 2) Projeto — cor + número à esquerda, dropdown largo e legível */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wide text-zinc-500">Projeto</label>
        <Select value={projChoice} onValueChange={(v) => { if (v) setProjChoice(v); }}>
          <SelectTrigger className="h-9 w-full text-sm bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="Selecione um projeto">
              {(value: unknown) => {
                if (value === NEW) return "➕ Criar novo projeto";
                if (!selectedProject) return "Selecione um projeto";
                return (
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0 tabular-nums">#{projectNumber.get(selectedProject.id)}</span>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: selectedProject.color }} />
                    <span className="truncate">{selectedProject.name}</span>
                  </span>
                );
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700/50 max-h-80 min-w-72">
            {sortedProjects.map((p) => (
              <SelectItem key={p.id} value={p.id} label={p.name} className="py-2 text-sm">
                <span className="text-[10px] font-mono text-zinc-500 w-7 shrink-0 text-right tabular-nums">#{projectNumber.get(p.id)}</span>
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                <span className="truncate">{p.name}</span>
              </SelectItem>
            ))}
            <SelectItem value={NEW} label="Criar novo projeto" className="py-2 text-sm text-violet-300">➕ Criar novo projeto</SelectItem>
          </SelectContent>
        </Select>
        {isNewProject && (
          <Input autoFocus value={newProjName} onChange={(e) => setNewProjName(e.target.value)} placeholder="Nome do novo projeto"
            className="h-8 bg-zinc-900 border-zinc-700 text-sm mt-1" />
        )}
      </div>

      {/* 3) Módulo — a atividade do setor onde a tarefa entra */}
      {projChoice && (
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-zinc-500">Módulo</label>
          {!isNewProject && projectModules.length > 0 && (
            <Select value={moduleChoice} onValueChange={(v) => { if (v) setModuleChoice(v); }}>
              <SelectTrigger className="h-9 w-full text-sm bg-zinc-900 border-zinc-700">
                <SelectValue placeholder="Selecione um módulo">
                  {(value: unknown) =>
                    value === NEW
                      ? "➕ Criar novo módulo"
                      : projectModules.find((m) => m.id === value)?.name ?? "Selecione um módulo"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700/50 max-h-72 min-w-64">
                {projectModules.map((m) => (
                  <SelectItem key={m.id} value={m.id} label={m.name}>{m.name}</SelectItem>
                ))}
                <SelectItem value={NEW} label="Criar novo módulo" className="text-violet-300">➕ Criar novo módulo</SelectItem>
              </SelectContent>
            </Select>
          )}
          {isNewModule && (
            <Input
              value={newModuleName}
              onChange={(e) => setNewModuleName(e.target.value)}
              placeholder="Nome do módulo (ex.: Backend, Front, Design...)"
              className="h-8 bg-zinc-900 border-zinc-700 text-sm mt-1"
            />
          )}
          {!isNewProject && projectModules.length === 0 && (
            <p className="text-[11px] text-zinc-500">O projeto ainda não tem módulos — este será o primeiro.</p>
          )}
        </div>
      )}

      {/* 4) O que foi feito (vira uma tarefa dentro do módulo) */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wide text-zinc-500">O que você fez <span className="text-zinc-600 normal-case">(vira uma tarefa)</span></label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Ajuste no login, correção do TLS..."
          className="h-8 bg-zinc-900 border-zinc-700 text-sm" />
      </div>

      {/* 4) Detalhes (opcional) */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wide text-zinc-500">Detalhes <span className="text-zinc-600 normal-case">(opcional)</span></label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Mais contexto sobre o trabalho..." rows={2}
          className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 outline-none focus:border-violet-500/50 resize-none" />
      </div>

      {/* 5) Horas + Data */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-zinc-500">Horas</label>
          <Input type="number" min="0" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="0"
            className="h-8 bg-zinc-900 border-zinc-700 text-sm" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-zinc-500">Data</label>
          <DatePicker value={wd} onChange={setWd} className="h-8" />
        </div>
      </div>

      {/* 6) Status */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wide text-zinc-500">Status</label>
        <Select value={status} onValueChange={(v) => v && setStatus(v as TaskStatus)}>
          <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700 w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {WORK_STATUS.map((s) => <SelectItem key={s.value} value={s.value} label={s.label}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* 7) Ação */}
      <Button type="submit" disabled={saving || !canSubmit} className="w-full h-9 text-xs bg-violet-600 hover:bg-violet-700 disabled:opacity-40 gap-1.5">
        {saving ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
        Adicionar tarefa
      </Button>
    </form>
  );
}
