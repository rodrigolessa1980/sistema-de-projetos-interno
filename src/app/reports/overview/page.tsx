"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { notFound } from "@/lib/router";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileBarChart2, FolderKanban, ListTodo, Clock,
  CheckCircle2, AlertTriangle, Users, TrendingUp, Zap,
} from "lucide-react";
import { PrintButton } from "@/components/shared/print-button";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";

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

export default function OverviewReportPage() {
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAdmin) notFound();

  const today = new Date().toISOString().split("T")[0];

  // Distribuição por status
  const statusDist = Object.entries(
    tasks.reduce<Record<string, number>>((acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ name: STATUS_LABELS[status] ?? status, value: count, fill: STATUS_COLORS[status] ?? "#6366f1" }));

  // Horas diárias dos últimos 14 dias
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });
  const dailyHours = last14Days.map((date) => ({
    date: date.slice(5), // MM-DD
    horas: timeLogs.filter((tl) => tl.date === date).reduce((acc, tl) => acc + tl.hours, 0),
  }));

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
    <AppLayout>
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
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Horas Registradas — Últimos 14 dias</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyHours}>
                <defs>
                  <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#a1a1aa" }}
                  formatter={(v: unknown) => [`${v}h`, "Horas"]}
                />
                <Area type="monotone" dataKey="horas" stroke="#6366f1" strokeWidth={2} fill="url(#hoursGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Distribuição por status */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Distribuição por Status</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                  {statusDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(v: unknown, name: unknown) => [v as number, name as string]}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px", color: "#71717a" }} />
              </PieChart>
            </ResponsiveContainer>
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
    </AppLayout>
  );
}
