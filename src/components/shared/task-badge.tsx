import { cn, getStatusColor, getStatusLabel, getComplexityColor, getComplexityLabel } from "@/lib/utils";
import type { TaskStatus, TaskComplexity } from "@/types";

export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border",
      getStatusColor(status),
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(status))} />
      {getStatusLabel(status)}
    </span>
  );
}

function getStatusDot(status: TaskStatus): string {
  const dots: Record<TaskStatus, string> = {
    BACKLOG: "bg-zinc-400",
    PLANEJADA: "bg-blue-400",
    BLOQUEADA: "bg-red-400",
    EM_DESENVOLVIMENTO: "bg-violet-400",
    EM_REVISAO: "bg-amber-400",
    HOMOLOGACAO: "bg-cyan-400",
    CONCLUIDA: "bg-emerald-400",
    CANCELADA: "bg-zinc-500",
  };
  return dots[status];
}

export function ComplexityBadge({ complexity, className }: { complexity: TaskComplexity; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold",
      getComplexityColor(complexity),
      className
    )}>
      {getComplexityLabel(complexity)}
    </span>
  );
}
