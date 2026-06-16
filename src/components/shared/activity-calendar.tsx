"use client";

import { useMemo, useState } from "react";
import {
  eachMonthOfInterval, startOfMonth, endOfMonth,
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
import { CalendarRange, Clock, Users, Pencil, Plus, Check, X, CalendarDays } from "lucide-react";
import { toISODate, DatePicker } from "@/components/ui/date-picker";
import { isInRange, type DateRange } from "@/components/shared/period-filter";
import { cn } from "@/lib/utils";
import Link from "@/lib/router";
import type { ModuleStatus } from "@/types";

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const NEW = "__new__";

const moduleStatusLabels: Record<ModuleStatus, string> = {
  INICIADO: "Iniciado",
  EM_PROCESSO: "Em processo",
  CONCLUIDO: "Concluído",
};

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
const MAX_MONTHS = 24;

/** Calendário de atividades (meses do período) com mapa de calor e editor de trabalho por dia. */
export function ActivityCalendar({ range, hiddenProjects = EMPTY_SET, hiddenDevs = EMPTY_SET }: Props) {
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin, user } = useAuth();

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const taskById = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);
  const projectById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const logsByDay = useMemo(() => {
    const map = new Map<string, typeof timeLogs>();
    for (const tl of timeLogs) {
      if (!isAdmin && tl.userId !== user?.id) continue;
      if (hiddenDevs.has(tl.userId)) continue;
      if (!isInRange(tl.date, range)) continue;
      const task = taskById.get(tl.taskId);
      if (task && hiddenProjects.has(task.projectId)) continue;
      const day = tl.date.split("T")[0];
      const list = map.get(day) ?? [];
      list.push(tl);
      map.set(day, list);
    }
    return map;
  }, [timeLogs, isAdmin, user?.id, range, hiddenProjects, hiddenDevs, taskById]);

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

  // Meses a exibir: do intervalo escolhido; em "Tudo", deriva do min/max dos registros.
  const months = useMemo(() => {
    let startIso = range.start;
    let endIso = range.end;
    if (!startIso || !endIso) {
      const keys = [...logsByDay.keys()].sort();
      if (keys.length === 0) return [startOfMonth(new Date())];
      startIso = startIso ?? keys[0];
      endIso = endIso ?? keys[keys.length - 1];
    }
    const list = eachMonthOfInterval({ start: startOfMonth(parseISO(startIso)), end: startOfMonth(parseISO(endIso)) });
    return list.length > MAX_MONTHS ? list.slice(list.length - MAX_MONTHS) : list;
  }, [range.start, range.end, logsByDay]);

  const dayLogs = selectedDay ? (logsByDay.get(selectedDay) ?? []) : [];
  const dayTotal = dayLogs.reduce((s, l) => s + l.hours, 0);
  const dayDevs = new Set(dayLogs.map((l) => l.userId)).size;
  const todayIso = toISODate(new Date());

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px] items-start">
      {/* Coluna do calendário */}
      <div className="space-y-4 min-w-0">
        <p className="text-xs text-zinc-500">
          <span className="text-zinc-300 font-medium">{range.label}</span> · {periodTotal.toFixed(1)}h em {activeDays} dia(s)
        </p>

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
      await useTaskStore.getState().fetchAllTimeLogs();
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
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do módulo" className="h-8 bg-zinc-950 border-zinc-700 text-sm" />
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
          <button type="button" onClick={() => setEditing(true)} title="Editar módulo"
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

/** Formulário para adicionar trabalho no dia: projeto (selecionar/criar) → módulo (selecionar/editar ou novo). */
function DayEditor({ day, ownerId }: { day: string; ownerId: string }) {
  const { projects, modules, createProject, createModule, updateModule, getModulesByProject } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin } = useAuth();

  const [open, setOpen] = useState(false);
  const [assignedUserId, setAssignedUserId] = useState(ownerId);
  const [projChoice, setProjChoice] = useState("");
  const [newProjName, setNewProjName] = useState("");
  const [modChoice, setModChoice] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [hours, setHours] = useState("");
  const [wd, setWd] = useState(day);
  const [status, setStatus] = useState<ModuleStatus>("CONCLUIDO");
  const [saving, setSaving] = useState(false);

  const projectModules = projChoice && projChoice !== NEW ? getModulesByProject(projChoice) : [];
  const isNewProject = projChoice === NEW;
  const isNewModule = modChoice === NEW || isNewProject;

  function onPickModule(value: string) {
    setModChoice(value);
    if (value && value !== NEW) {
      const m = modules.find((mod) => mod.id === value);
      setName(m?.name ?? "");
      setDesc(m?.description ?? "");
      setStatus((m?.status as ModuleStatus) ?? "CONCLUIDO");
      setHours(m?.loggedHours != null ? String(m.loggedHours) : "");
      setWd(m?.workDate ?? day);
    } else {
      setName(""); setDesc(""); setStatus("CONCLUIDO"); setHours(""); setWd(day);
    }
  }

  function reset() {
    setProjChoice(""); setNewProjName(""); setModChoice("");
    setName(""); setDesc(""); setHours(""); setWd(day); setStatus("CONCLUIDO");
    setAssignedUserId(ownerId);
    setOpen(false);
  }

  async function save() {
    if (!name.trim()) { toast.error("Informe o nome do módulo"); return; }
    setSaving(true);
    try {
      let projectId = projChoice;
      if (isNewProject) {
        if (!newProjName.trim()) { toast.error("Informe o nome do projeto"); setSaving(false); return; }
        const proj = await createProject({
          name: newProjName.trim(),
          description: "Criado pelo calendário de atividades.",
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

      const h = Number(hours);
      if (!h || h <= 0) { toast.error("Informe as horas (maior que 0)"); setSaving(false); return; }

      if (!isNewModule && modChoice) {
        // Editar módulo existente (nome/descrição/status/data/horas)
        await updateModule(modChoice, { name: name.trim(), description: desc.trim(), status, workDate: wd, hours: h });
        await useTaskStore.getState().fetchAllTimeLogs();
        toast.success("Módulo atualizado");
      } else {
        // Novo módulo com horas na data escolhida
        await createModule({
          projectId,
          name: name.trim(),
          description: desc.trim() || `Trabalho em ${wd}`,
          status,
          hours: h,
          workDate: wd,
          assignedUserId: isAdmin ? assignedUserId : undefined,
        });
        await useTaskStore.getState().fetchAllTimeLogs();
        const who = users.find((u) => u.id === assignedUserId)?.name;
        toast.success(`Módulo adicionado com ${h}h em ${wd.split("-").reverse().join("/")}${isAdmin && who ? ` para ${who.split(" ")[0]}` : ""}`);
      }
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
        <Plus className="w-3.5 h-3.5" /> Adicionar trabalho neste dia
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/50 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-zinc-300">Adicionar trabalho</p>
        <button type="button" onClick={reset} className="text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4" /></button>
      </div>

      {/* 0) Desenvolvedor (só admin pode lançar para outro) */}
      {isAdmin && (
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-zinc-500">Desenvolvedor</label>
          <Select value={assignedUserId} onValueChange={(v) => v && setAssignedUserId(v)}>
            <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700"><SelectValue placeholder="Selecione o desenvolvedor" /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50 max-h-64">
              {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 1) Projeto */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wide text-zinc-500">Projeto</label>
        <Select value={projChoice} onValueChange={(v) => { if (!v) return; setProjChoice(v); setModChoice(""); setName(""); setDesc(""); }}>
          <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700"><SelectValue placeholder="Selecione um projeto" /></SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700/50 max-h-64">
            {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            <SelectItem value={NEW}>➕ Criar novo projeto</SelectItem>
          </SelectContent>
        </Select>
        {isNewProject && (
          <Input autoFocus value={newProjName} onChange={(e) => setNewProjName(e.target.value)} placeholder="Nome do novo projeto"
            className="h-8 bg-zinc-900 border-zinc-700 text-sm mt-1" />
        )}
      </div>

      {/* 2) Módulo */}
      {projChoice && !isNewProject && (
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wide text-zinc-500">Módulo</label>
          <Select value={modChoice} onValueChange={(v) => v && onPickModule(v)}>
            <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700"><SelectValue placeholder="Novo módulo ou selecione p/ editar" /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50 max-h-64">
              <SelectItem value={NEW}>➕ Novo módulo</SelectItem>
              {projectModules.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 3) Campos do módulo */}
      {(isNewProject || modChoice) && (
        <div className="space-y-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do módulo / entrega"
            className="h-8 bg-zinc-900 border-zinc-700 text-sm" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="O que foi feito..." rows={2}
            className="w-full text-sm bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 outline-none focus:border-violet-500/50 resize-none" />
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-zinc-500">Data</label>
              <DatePicker value={wd} onChange={setWd} className="h-8" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wide text-zinc-500">Horas</label>
              <Input type="number" min="0" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="0"
                className="h-8 bg-zinc-900 border-zinc-700 text-sm" />
            </div>
          </div>
          <Select value={status} onValueChange={(v) => v && setStatus(v as ModuleStatus)}>
            <SelectTrigger className="h-8 text-xs bg-zinc-900 border-zinc-700 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(moduleStatusLabels).map(([v, label]) => <SelectItem key={v} value={v}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={save} disabled={saving} className="w-full h-8 text-xs bg-violet-600 hover:bg-violet-700 gap-1.5">
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {isNewModule ? "Adicionar" : "Salvar alterações"}
          </Button>
        </div>
      )}
    </div>
  );
}
