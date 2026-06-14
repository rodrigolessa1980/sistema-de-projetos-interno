"use client";

import { useState } from "react";
import { eachDayOfInterval, parseISO, subDays } from "date-fns";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { notFound } from "@/lib/router";
import { motion } from "@/lib/motion";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toISODate } from "@/components/ui/date-picker";
import {
  FileBarChart2, FolderKanban, ListTodo, Clock,
  AlertTriangle, Users, Zap,
} from "lucide-react";
import { PrintButton } from "@/components/shared/print-button";
import { MetricsAreaChart, MetricsPieChart } from "@/components/shared/mui-charts";
import { cn, formatDate } from "@/lib/utils";

const STATUS_COLORS: Record<string, string> = {
  BACKLOG: "#52525b",
  PLANEJADA: "#6366f1",
  EM_DESENVOLVIMENTO: "#3b82f6",
  EM_REVISAO: "#f59e0b",
  HOMOLOGACAO: "#8b5cf6",
  CONCLUIDA: "#22c55e",
  BLOQUEADA: "#ef4444",
  CANCELADA: "#71717a",
};

const STATUS_LABELS: Record<string, string> = {
  BACKLOG: "Backlog", PLANEJADA: "Planejada", EM_DESENVOLVIMENTO: "Em Dev",
  EM_REVISAO: "Em Revisão", HOMOLOGACAO: "Homologação", CONCLUIDA: "Concluída",
  BLOQUEADA: "Bloqueada", CANCELADA: "Cancelada",
};

type HoursChartPreset = "7" | "14" | "30" | "90" | "custom";

const HOURS_CHART_PRESETS: { value: HoursChartPreset; label: string; days?: number }[] = [
  { value: "7", label: "7 dias", days: 7 },
  { value: "14", label: "14 dias", days: 14 },
  { value: "30", label: "30 dias", days: 30 },
  { value: "90", label: "90 dias", days: 90 },
];

function getPresetRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = subDays(end, days - 1);
  return { start: toISODate(start), end: toISODate(end) };
}

function buildDateRange(start: string, end: string): Date[] {
  const from = parseISO(start);
  const to = parseISO(end);
  if (from > to) return eachDayOfInterval({ start: to, end: from });
  return eachDayOfInterval({ start: from, end: to });
}

export default function OverviewReportPage() {
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin, isLoading } = useAuth();

  const [hoursPreset, setHoursPreset] = useState<HoursChartPreset>("14");
  const [hoursStart, setHoursStart] = useState(() => getPresetRange(14).start);
  const [hoursEnd, setHoursEnd] = useState(() => getPresetRange(14).end);

  if (isLoading) return null;
  if (!isAdmin) notFound();

  const today = toISODate(new Date());

  function applyHoursPreset(preset: HoursChartPreset) {
    const option = HOURS_CHART_PRESETS.find((p) => p.value === preset);
    if (!option?.days) return;
    const { start, end } = getPresetRange(option.days);
    setHoursStart(start);
    setHoursEnd(end);
    setHoursPreset(preset);
  }

  function handleHoursStartChange(value: string) {
    setHoursStart(value);
    setHoursPreset("custom");
    if (value > hoursEnd) setHoursEnd(value);
  }

  function handleHoursEndChange(value: string) {
    setHoursEnd(value);
    setHoursPreset("custom");
    if (value < hoursStart) setHoursStart(value);
  }

  const hoursRangeLabel = hoursPreset === "custom"
    ? `${formatDate(hoursStart)} — ${formatDate(hoursEnd)}`
    : `Últimos ${hoursPreset} dias`;

  // Distribuição por status
  const statusDist = Object.entries(
    tasks.reduce<Record<string, number>>((acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ name: STATUS_LABELS[status] ?? status, value: count, fill: STATUS_COLORS[status] ?? "#6366f1" }));

  const dailyHours = buildDateRange(hoursStart, hoursEnd).map((day) => {
    const iso = toISODate(day);
    return {
      date: iso.slice(5),
      horas: timeLogs.filter((tl) => tl.date === iso).reduce((acc, tl) => acc + tl.hours, 0),
    };
  });

  // Stats gerais
  const totalHours = timeLogs.reduce((acc, tl) => acc + tl.hours, 0);
  const overdueTasks = tasks.filter(
    (t) => t.dueDate && t.dueDate < today && !["CONCLUIDA", "CANCELADA"].includes(t.status)
  ).length;
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.status === "CONCLUIDA").length / tasks.length) * 100) : 0;

  // Top tarefas por horas
  const topTasks = [...tasks]
    .sort((a, b) => b.actualHours - a.actualHours)
    .slice(0, 5)
    .map((t) => ({
      task: t,
      project: projects.find((p) => p.id === t.projectId),
      assignee: users.find((u) => u.id === t.assigneeId),
    }));

  return (
      <div className="p-6 w-full space-y-6" data-print-content
        data-print-footer
        data-date={new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}>
        <div className="flex items-start justify-between gap-4" data-print-header>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <FileBarChart2 className="w-5 h-5 text-violet-400" />
              Visão Geral — Relatório Executivo
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Resumo completo do sistema · Apenas Administradores</p>
          </div>
          <PrintButton />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total de Projetos", value: projects.length, sub: `${projects.filter(p => p.status === "ATIVO").length} ativos`, icon: FolderKanban, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Total de Tarefas", value: tasks.length, sub: `${completionRate}% concluídas`, icon: ListTodo, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Horas Registradas", value: `${totalHours.toFixed(0)}h`, sub: "em todo o histórico", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
            { label: "Atrasadas", value: overdueTasks, sub: overdueTasks === 0 ? "tudo em dia ✓" : "requerem atenção", icon: AlertTriangle, color: overdueTasks === 0 ? "text-emerald-400" : "text-orange-400", bg: overdueTasks === 0 ? "bg-emerald-500/10" : "bg-orange-500/10" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4"
            >
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${s.bg}`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium text-zinc-300 mt-0.5">{s.label}</p>
              <p className="text-[11px] text-zinc-600">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Horas diárias */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-zinc-200">Horas Registradas</h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">{hoursRangeLabel}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2" data-print-hide>
                {HOURS_CHART_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => applyHoursPreset(preset.value)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border",
                      hoursPreset === preset.value
                        ? "bg-violet-600/20 text-violet-300 border-violet-500/30"
                        : "bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:text-zinc-200",
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
                <div className="flex items-center gap-1.5">
                  <Input
                    type="date"
                    value={hoursStart}
                    max={hoursEnd}
                    onChange={(e) => handleHoursStartChange(e.target.value)}
                    className="w-[132px] h-7 text-xs bg-zinc-800/50 border-zinc-700/50 text-zinc-300"
                  />
                  <span className="text-zinc-600 text-xs">—</span>
                  <Input
                    type="date"
                    value={hoursEnd}
                    min={hoursStart}
                    max={today}
                    onChange={(e) => handleHoursEndChange(e.target.value)}
                    className="w-[132px] h-7 text-xs bg-zinc-800/50 border-zinc-700/50 text-zinc-300"
                  />
                </div>
              </div>
            </div>
            <MetricsAreaChart
              data={dailyHours}
              xKey="date"
              height={200}
              series={[{ key: "horas", label: "Horas", color: "#6366f1" }]}
            />
          </motion.div>

          {/* Distribuição por status */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Distribuição por Status</h2>
            <MetricsPieChart
              height={240}
              items={statusDist.map((entry) => ({
                label: entry.name,
                value: entry.value,
                color: entry.fill,
              }))}
            />
          </motion.div>
        </div>

        {/* Top tarefas por horas */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
        >
          <h2 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Top 5 Tarefas por Horas Consumidas
          </h2>
          <div className="space-y-3">
            {topTasks.map(({ task, project, assignee }, i) => (
              <div key={task.id} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-zinc-200 truncate">{task.title}</span>
                    {project && (
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
                        <span className="text-[10px] text-zinc-500">{project.name}</span>
                      </div>
                    )}
                  </div>
                  <Progress
                    value={task.estimatedHours > 0 ? Math.min((task.actualHours / task.estimatedHours) * 100, 100) : 0}
                    className="h-1.5 bg-zinc-800"
                  />
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-zinc-200">{task.actualHours}h</p>
                  <p className="text-[10px] text-zinc-600">de {task.estimatedHours}h</p>
                </div>
                {assignee && (
                  <Avatar className="w-6 h-6 shrink-0">
                    <AvatarImage src={assignee.avatar} />
                    <AvatarFallback className="text-[8px] bg-zinc-700">{assignee.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Equipe */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
        >
          <h2 className="text-sm font-semibold text-zinc-200 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            Equipe — Resumo por Desenvolvedor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((u, i) => {
              const userTasks = tasks.filter((t) => t.assigneeId === u.id);
              const done = userTasks.filter((t) => t.status === "CONCLUIDA").length;
              const active = userTasks.filter((t) => t.status === "EM_DESENVOLVIMENTO").length;
              const hours = timeLogs.filter((tl) => tl.userId === u.id).reduce((acc, tl) => acc + tl.hours, 0);
              const rate = userTasks.length > 0 ? Math.round((done / userTasks.length) * 100) : 0;
              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg"
                >
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold">
                      {u.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 truncate">{u.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                      <span>{done}/{userTasks.length} tarefas</span>
                      {active > 0 && <span className="text-violet-400">{active} ativas</span>}
                    </div>
                    <Progress value={rate} className="h-1 bg-zinc-700 mt-1" />
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-zinc-300">{hours}h</p>
                    <p className="text-[9px] text-zinc-600">registradas</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
  );
}
