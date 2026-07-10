import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TaskStatus, TaskComplexity } from "@/types";

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

export const ALL_STATUSES: TaskStatus[] = [
  "BACKLOG", "PLANEJADA", "BLOQUEADA", "EM_DESENVOLVIMENTO",
  "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA", "CANCELADA",
];

export const COMPLEXITY_OPTIONS: TaskComplexity[] = [1, 2, 3, 5, 8];
