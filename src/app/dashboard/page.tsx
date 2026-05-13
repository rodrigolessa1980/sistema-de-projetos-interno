"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/task-badge";
import { useMetrics } from "@/hooks/use-metrics";
import { useProjectStore, useTaskStore, useUserStore, useAuthStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatRelativeTime, getStatusLabel } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  FolderKanban, ListTodo, CheckCircle2, AlertTriangle, Clock,
  TrendingUp, Users, Zap, ArrowRight, Circle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { summary, burndownData, velocityData, complexityDistribution, tasksByStatus } = useMetrics();
  const { projects } = useProjectStore();
  const { tasks, timeLogs } = useTaskStore();
  const { users } = useUserStore();

  const myTasks = isAdmin
    ? tasks.filter((t) => ["EM_DESENVOLVIMENTO", "EM_REVISAO"].includes(t.status)).slice(0, 5)
    : tasks.filter((t) => t.assigneeId === user?.id).slice(0, 5);

  const recentActivity = timeLogs.slice(-5).reverse();

  return (
    <AppLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">
              Olá, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-zinc-500">Sistema operacional</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Projetos Ativos" value={summary.activeProjects} subtitle={`de ${summary.totalProjects} total`}
            icon={FolderKanban} color="violet" delay={0.05} trend={8}
          />
          <StatCard
            title="Tasks Abertas" value={summary.totalTasks - summary.completedTasks}
            subtitle={`${summary.completedTasks} concluídas`}
            icon={ListTodo} color="blue" delay={0.1}
          />
          <StatCard
            title="Concluídas" value={summary.completedTasks}
            subtitle={`${Math.round((summary.completedTasks / Math.max(summary.totalTasks, 1)) * 100)}% do total`}
            icon={CheckCircle2} color="emerald" delay={0.15} trend={12}
          />
          <StatCard
            title="Bloqueadas" value={summary.blockedTasks} subtitle="requer atenção"
            icon={AlertTriangle} color="red" delay={0.2} trend={-3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Progresso dos Projetos</h3>
                <p className="text-xs text-zinc-500">Burndown das últimas 2 semanas</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={burndownData}>
                <defs>
                  <linearGradient id="colorEstimado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }}
                  labelStyle={{ color: "#a1a1aa" }}
                />
                <Area type="monotone" dataKey="estimado" name="Estimado" stroke="#6366f1" strokeWidth={2} fill="url(#colorEstimado)" />
                <Area type="monotone" dataKey="real" name="Real" stroke="#22c55e" strokeWidth={2} fill="url(#colorReal)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <h3 className="text-sm font-semibold text-zinc-100 mb-4">Distribuição por Status</h3>
            <div className="space-y-2.5">
              {Object.entries(tasksByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <StatusBadge status={status as import("@/types").TaskStatus} className="text-[10px] px-1.5 py-0.5 shrink-0" />
                  <div className="flex-1 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / summary.totalTasks) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="h-full bg-violet-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-zinc-400 w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-100">
                {isAdmin ? "Tasks em Andamento" : "Minhas Tasks"}
              </h3>
              <Link href="/tasks" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                Ver todas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {myTasks.map((task) => {
                const assignee = users.find((u) => u.id === task.assigneeId);
                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/40 hover:bg-zinc-800/70 transition-colors group"
                  >
                    <Circle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 truncate group-hover:text-white">{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge status={task.status} className="text-[9px] px-1 py-0" />
                        {task.dueDate && (
                          <span className="text-[10px] text-zinc-500">{formatDate(task.dueDate)}</span>
                        )}
                      </div>
                    </div>
                    <Avatar className="w-6 h-6 shrink-0">
                      <AvatarImage src={assignee?.avatar} />
                      <AvatarFallback className="text-[9px] bg-zinc-700">{assignee?.name?.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-100">Projetos</h3>
              <Link href="/projects" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {projects.slice(0, 4).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: project.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-zinc-200 truncate group-hover:text-white">{project.name}</p>
                      <span className="text-xs text-zinc-500 shrink-0 ml-2">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5 bg-zinc-800" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Precisão de Est." value={`${summary.estimationAccuracy}%`} icon={TrendingUp} color="emerald" delay={0.45} />
          <StatCard title="Lead Time Médio" value={`${summary.averageLeadTime}d`} icon={Clock} color="blue" delay={0.5} />
          <StatCard title="Cycle Time" value={`${summary.averageCycleTime}d`} icon={Zap} color="amber" delay={0.55} />
          <StatCard title="Throughput" value={`${summary.throughput}/sem`} icon={Users} color="violet" delay={0.6} />
        </div>
      </div>
    </AppLayout>
  );
}
