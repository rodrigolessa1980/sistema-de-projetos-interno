"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "@/lib/motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Timer, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PrintButton } from "@/components/shared/print-button";
import { StatusBadge } from "@/components/shared/task-badge";
import Link from "@/lib/router";

export default function HoursReportPage() {
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin, user } = useAuth();

  const [projectFilter, setProjectFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  const today = new Date();
  const periodStart: Record<string, Date | null> = {
    today: new Date(today.toISOString().split("T")[0]),
    week: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    month: new Date(today.getFullYear(), today.getMonth(), 1),
    all: null,
  };

  const cutoff = periodStart[periodFilter] ?? null;

  const filteredLogs = timeLogs.filter((tl) => {
    if (userFilter !== "all" && tl.userId !== userFilter) return false;
    if (cutoff && new Date(tl.date) < cutoff) return false;
    const task = tasks.find((t) => t.id === tl.taskId);
    if (!task) return false;
    if (projectFilter !== "all" && task.projectId !== projectFilter) return false;
    if (!isAdmin && tl.userId !== user?.id) return false;
    return true;
  });

  // Agrupa por tarefa
  const byTask = filteredLogs.reduce<Record<string, { hours: number; taskId: string }>>((acc, tl) => {
    acc[tl.taskId] = acc[tl.taskId] ?? { hours: 0, taskId: tl.taskId };
    acc[tl.taskId].hours += tl.hours;
    return acc;
  }, {});

  const taskRows = Object.values(byTask)
    .map(({ taskId, hours }) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return null;
      const project = projects.find((p) => p.id === task.projectId);
      const assignee = users.find((u) => u.id === task.assigneeId);
      const deviation = task.estimatedHours > 0
        ? ((hours - task.estimatedHours) / task.estimatedHours) * 100
        : 0;
      return { task, project, assignee, hours, deviation };
    })
    .filter(Boolean)
    .sort((a, b) => b!.hours - a!.hours) as NonNullable<ReturnType<typeof Array.prototype.filter>[number]>[];

  const totalHours = taskRows.reduce((acc, r) => acc + r.hours, 0);
  const totalEstimated = taskRows.reduce((acc, r) => acc + r.task.estimatedHours, 0);
  const overBudget = taskRows.filter((r) => r.deviation > 10).length;

  return (
    <AppLayout>
      <div className="p-6 w-full space-y-6" data-print-content
        data-print-footer
        data-date={new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}>
        <div className="flex items-start justify-between gap-4" data-print-header>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Timer className="w-5 h-5 text-violet-400" />
              Horas por Tarefa
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Horas registradas vs estimadas por tarefa</p>
          </div>
          <PrintButton />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3" data-print-hide>
          <Select value={periodFilter} onValueChange={(v) => v && setPeriodFilter(v)}>
            <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50">
              <SelectItem value="all">Todo o período</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
            </SelectContent>
          </Select>

          <Select value={projectFilter} onValueChange={(v) => v && setProjectFilter(v)}>
            <SelectTrigger className="w-44 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-8 text-xs">
              <SelectValue placeholder="Todos os projetos" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50">
              <SelectItem value="all">Todos os projetos</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>

          {isAdmin && (
            <Select value={userFilter} onValueChange={(v) => v && setUserFilter(v)}>
              <SelectTrigger className="w-44 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-8 text-xs">
                <SelectValue placeholder="Todos os usuários" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700/50">
                <SelectItem value="all">Todos os usuários</SelectItem>
                {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Registrado", value: `${totalHours.toFixed(1)}h`, sub: `de ${totalEstimated}h estimadas`, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Utilização", value: `${totalEstimated > 0 ? Math.round((totalHours / totalEstimated) * 100) : 0}%`, sub: "do estimado consumido", color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Acima do Orçamento", value: overBudget, sub: "tarefa(s) com +10% de desvio", color: overBudget > 0 ? "text-orange-400" : "text-emerald-400", bg: overBudget > 0 ? "bg-orange-500/10" : "bg-emerald-500/10" },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-3 ${s.bg}`}>
                <Clock className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium text-zinc-400 mt-0.5">{s.label}</p>
              <p className="text-[11px] text-zinc-600">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabela */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl overflow-hidden"
        >
          <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-zinc-800/50 text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
            <div className="col-span-4">Tarefa</div>
            <div className="col-span-2">Projeto</div>
            <div className="col-span-2">Responsável</div>
            <div className="col-span-2 text-center">Estimado / Real</div>
            <div className="col-span-2 text-right">Desvio</div>
          </div>

          {taskRows.length === 0 && (
            <div className="text-center py-12 text-zinc-600 text-sm">
              Nenhum registro de hora encontrado para os filtros selecionados
            </div>
          )}

          <div className="divide-y divide-zinc-800/30">
            {taskRows.map((row, i) => (
              <motion.div
                key={row.task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-zinc-800/20 transition-colors"
              >
                <div className="col-span-4 min-w-0">
                  <Link href={`/tasks/${row.task.id}`} className="text-sm text-zinc-200 hover:text-violet-400 transition-colors truncate block">
                    {row.task.title}
                  </Link>
                  <StatusBadge status={row.task.status} className="text-[9px] px-1 py-0 mt-0.5" />
                </div>
                <div className="col-span-2 min-w-0">
                  {row.project && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: row.project.color }} />
                      <span className="text-xs text-zinc-400 truncate">{row.project.name}</span>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  {row.assignee && (
                    <div className="flex items-center gap-1.5">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={row.assignee.avatar} />
                        <AvatarFallback className="text-[8px] bg-zinc-700">{row.assignee.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-zinc-400 truncate">{row.assignee.name.split(" ")[0]}</span>
                    </div>
                  )}
                </div>
                <div className="col-span-2">
                  <div className="text-center mb-1">
                    <span className="text-xs text-zinc-500">{row.task.estimatedHours}h</span>
                    <span className="text-zinc-700 mx-1">/</span>
                    <span className={`text-xs font-semibold ${row.hours > row.task.estimatedHours ? "text-orange-400" : "text-zinc-300"}`}>
                      {row.hours.toFixed(1)}h
                    </span>
                  </div>
                  <Progress
                    value={row.task.estimatedHours > 0 ? Math.min((row.hours / row.task.estimatedHours) * 100, 100) : 0}
                    className="h-1 bg-zinc-800"
                  />
                </div>
                <div className="col-span-2 text-right">
                  <div className={`inline-flex items-center gap-1 text-xs font-semibold ${
                    row.deviation > 10 ? "text-orange-400" : row.deviation < -10 ? "text-emerald-400" : "text-zinc-400"
                  }`}>
                    {row.deviation > 5 ? <TrendingUp className="w-3 h-3" /> : row.deviation < -5 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {row.deviation > 0 ? "+" : ""}{row.deviation.toFixed(0)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
