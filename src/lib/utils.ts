import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Task, TaskStatus, TaskComplexity, ModuleStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(dateStr));
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "agora mesmo";
  if (diffMins < 60) return `há ${diffMins}min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays}d`;
  return formatDate(dateStr);
}

export function getStatusLabel(status: TaskStatus): string {
  const labels: Record<TaskStatus, string> = {
    BACKLOG: "Backlog",
    PLANEJADA: "Planejada",
    BLOQUEADA: "Bloqueada",
    EM_DESENVOLVIMENTO: "Em Desenvolvimento",
    EM_REVISAO: "Em Revisão",
    HOMOLOGACAO: "Homologação",
    CONCLUIDA: "Concluída",
    CANCELADA: "Cancelada",
  };
  return labels[status];
}

export function getStatusColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    BACKLOG: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    PLANEJADA: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    BLOQUEADA: "bg-red-500/20 text-red-400 border-red-500/30",
    EM_DESENVOLVIMENTO: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    EM_REVISAO: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    HOMOLOGACAO: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    CONCLUIDA: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    CANCELADA: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
  };
  return colors[status];
}

export function getStatusDotColor(status: TaskStatus): string {
  const colors: Record<TaskStatus, string> = {
    BACKLOG: "bg-zinc-400",
    PLANEJADA: "bg-blue-400",
    BLOQUEADA: "bg-red-400",
    EM_DESENVOLVIMENTO: "bg-violet-400",
    EM_REVISAO: "bg-amber-400",
    HOMOLOGACAO: "bg-cyan-400",
    CONCLUIDA: "bg-emerald-400",
    CANCELADA: "bg-zinc-500",
  };
  return colors[status];
}

export function getComplexityLabel(complexity: TaskComplexity): string {
  const labels: Record<TaskComplexity, string> = { 1: "XS", 2: "S", 3: "M", 5: "L", 8: "XL" };
  return labels[complexity];
}

export function getComplexityColor(complexity: TaskComplexity): string {
  const colors: Record<TaskComplexity, string> = {
    1: "bg-emerald-500/20 text-emerald-400",
    2: "bg-blue-500/20 text-blue-400",
    3: "bg-amber-500/20 text-amber-400",
    5: "bg-orange-500/20 text-orange-400",
    8: "bg-red-500/20 text-red-400",
  };
  return colors[complexity];
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  return `${hours}h`;
}

export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Paleta para categorizar módulos por cor. Como o backend não guarda uma cor
// por módulo, derivamos uma cor determinística do id: o mesmo módulo sempre
// aparece com a mesma cor, em qualquer tela.
const MODULE_COLORS = [
  "#8b5cf6", "#06b6d4", "#f97316", "#10b981", "#ef4444",
  "#eab308", "#ec4899", "#3b82f6", "#14b8a6", "#a855f7",
];

export function moduleColorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return MODULE_COLORS[hash % MODULE_COLORS.length];
}

// Prefixo curto do id — rótulo rápido para diferenciar módulos de nome parecido.
export function shortId(id: string): string {
  return id.slice(0, 4).toUpperCase();
}

// ── Semântica de status da tarefa (SSOT) ──────────────────────────────────
// Regra ÚNICA de "aberta / concluída / cancelada / ativa". Antes cada tela
// decidia isso na mão (`status === "CONCLUIDA"`, `!["CONCLUIDA","CANCELADA"]`,
// `!== "CONCLUIDA"`) com variações — origem de listas/contagens que não batiam.

/** Status terminais: a tarefa saiu do fluxo de trabalho. */
export const TERMINAL_STATUSES: TaskStatus[] = ["CONCLUIDA", "CANCELADA"];
/** Status "em andamento" (trabalho ativo acontecendo). */
export const ACTIVE_STATUSES: TaskStatus[] = ["EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO"];

export const isDone = (status: TaskStatus): boolean => status === "CONCLUIDA";
export const isCancelled = (status: TaskStatus): boolean => status === "CANCELADA";
/** Encerrada (concluída OU cancelada) — não conta como trabalho pendente. */
export const isTerminal = (status: TaskStatus): boolean => TERMINAL_STATUSES.includes(status);
/** Aberta = ainda no fluxo (nem concluída nem cancelada). */
export const isOpen = (status: TaskStatus): boolean => !isTerminal(status);
/** Ativa = trabalho em andamento (dev/revisão/homologação). */
export const isActive = (status: TaskStatus): boolean => ACTIVE_STATUSES.includes(status);

/**
 * Módulo concluído (SSOT). ModuleStatus é um enum próprio ("INICIADO" |
 * "EM_PROCESSO" | "CONCLUIDO") — distinto de TaskStatus — e não tem estado
 * "cancelado", então "concluído" e "terminal" coincidem para módulos.
 * Use isto em vez de `status === "CONCLUIDO"` na mão.
 */
export const isModuleDone = (status: ModuleStatus): boolean => status === "CONCLUIDO";

// ── Datas e horas (SSOT) ───────────────────────────────────────────────────

/** Data de hoje em "YYYY-MM-DD" (fuso local). Fonte única do "hoje". */
export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

/** Horas em formato curto: "1.5h" (≥1h) ou "45m" (<1h); "0h" quando zero. */
export function formatHoursShort(hours: number): string {
  if (hours <= 0) return "0h";
  return hours >= 1 ? `${hours.toFixed(1)}h` : `${Math.round(hours * 60)}m`;
}

// ── Situação de prazo e de horas ──────────────────────────────────────────
// Regra ÚNICA de "dentro do prazo / atrasado" e "dentro do estimado / estourou",
// para dashboard, kanban, gantt e detalhe usarem a MESMA conta (antes era
// `dueDate < hoje` copiado com variações e sem olhar entrega nem horas).

export type ScheduleStatus =
  | "sem-prazo"
  | "no-prazo"
  | "atrasada"
  | "entregue-no-prazo"
  | "entregue-com-atraso";

export interface ScheduleInfo {
  status: ScheduleStatus;
  /** Dias de atraso (>0). Aberta: hoje − prazo. Concluída: entrega − prazo. */
  daysLate: number;
  /** true quando há atraso (aberta vencida OU entregue após o prazo). */
  isLate: boolean;
}

/** Diferença em dias inteiros entre dois dias (compara só a data, ignora hora/fuso). */
function dayDiff(aDay: string, bDay: string): number {
  const a = Date.parse(`${aDay.split("T")[0]}T00:00:00Z`);
  const b = Date.parse(`${bDay.split("T")[0]}T00:00:00Z`);
  return Math.round((a - b) / 86_400_000);
}

/**
 * Situação de PRAZO a partir de `dueDate` (planejado) e `completedAt` (entregue):
 *  - aberta sem prazo          → "sem-prazo"
 *  - aberta, hoje > prazo      → "atrasada"            (daysLate = hoje − prazo)
 *  - aberta, dentro do prazo   → "no-prazo"
 *  - concluída até o prazo     → "entregue-no-prazo"
 *  - concluída após o prazo    → "entregue-com-atraso" (daysLate = entrega − prazo)
 * CANCELADA é neutra ("sem-prazo").
 */
export function getScheduleStatus(task: Task, now: Date = new Date()): ScheduleInfo {
  if (isCancelled(task.status)) return { status: "sem-prazo", daysLate: 0, isLate: false };

  const done = isDone(task.status);
  if (!task.dueDate) {
    return { status: done ? "entregue-no-prazo" : "sem-prazo", daysLate: 0, isLate: false };
  }

  if (done) {
    const delivered = task.completedAt ?? task.dueDate;
    const daysLate = dayDiff(delivered, task.dueDate);
    return daysLate > 0
      ? { status: "entregue-com-atraso", daysLate, isLate: true }
      : { status: "entregue-no-prazo", daysLate: 0, isLate: false };
  }

  const daysLate = dayDiff(now.toISOString().split("T")[0], task.dueDate);
  return daysLate > 0
    ? { status: "atrasada", daysLate, isLate: true }
    : { status: "no-prazo", daysLate: 0, isLate: false };
}

/** Rótulo pt-BR da situação de prazo. */
export function getScheduleLabel(info: ScheduleInfo): string {
  switch (info.status) {
    case "atrasada":
      return `Atrasada · ${info.daysLate}d`;
    case "entregue-com-atraso":
      return `Entregue com ${info.daysLate}d de atraso`;
    case "entregue-no-prazo":
      return "Entregue no prazo";
    case "no-prazo":
      return "No prazo";
    default:
      return "Sem prazo";
  }
}

export type HoursStatus = "sem-estimativa" | "dentro" | "estourou";

export interface HoursInfo {
  status: HoursStatus;
  /** Desvio percentual: (real − estimado) / estimado × 100. >0 = estourou. */
  deviationPct: number;
  over: boolean;
}

/** Situação de HORAS a partir de `estimatedHours` (planejado) e `actualHours` (real). */
export function getHoursStatus(task: Task): HoursInfo {
  const est = task.estimatedHours;
  if (!est || est <= 0) return { status: "sem-estimativa", deviationPct: 0, over: false };
  const deviationPct = Math.round(((task.actualHours - est) / est) * 100);
  return task.actualHours > est
    ? { status: "estourou", deviationPct, over: true }
    : { status: "dentro", deviationPct, over: false };
}

export const ALL_STATUSES: TaskStatus[] = [
  "BACKLOG", "PLANEJADA", "BLOQUEADA", "EM_DESENVOLVIMENTO",
  "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA", "CANCELADA",
];

export const COMPLEXITY_OPTIONS: TaskComplexity[] = [1, 2, 3, 5, 8];
