"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/shared/stat-card";
import { PageLoading } from "@/components/shared/page-loading";
import { StatusBadge } from "@/components/shared/task-badge";
import { useMetrics } from "@/hooks/use-metrics";
import { useProjectStore, useTaskStore, useUserStore, useAuthStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatRelativeTime, getStatusLabel } from "@/lib/utils";
import { motion } from "@/lib/motion";
import {
  FolderKanban, ListTodo, CheckCircle2, AlertTriangle, Clock,
  TrendingUp, Users, Zap, ArrowRight, Circle, Medal, Trophy, Timer, CalendarX,
} from "lucide-react";
import { useWorkSessionStore } from "@/stores/work-session-store";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MetricsAreaChart } from "@/components/shared/mui-charts";
import Link from "@/lib/router";
import { Badge } from "@/components/ui/badge";
import {
  PeriodFilter,
  rangeFromPreset,
  isInRange,
  type DateRange,
  type PresetKey,
} from "@/components/shared/period-filter";

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { summary, burndownData, velocityData, complexityDistribution, tasksByStatus } = useMetrics();
  const { projects } = useProjectStore();
  const hasLoaded = useProjectStore((s) => s.hasLoaded);
  const { tasks, timeLogs } = useTaskStore();
  const { users } = useUserStore();

  const { activeSession, getElapsedSeconds } = useWorkSessionStore();

  // Filtro de período do dashboard
  const [preset, setPreset] = useState<PresetKey>("30d");
  const [range, setRange] = useState<DateRange>(() => rangeFromPreset("30d"));
  const hoursColLabel = preset === "hoje" ? "Horas hoje" : "Horas no período";
  const totalLabel = preset === "hoje" ? "Total do dia" : "Total do período";

  // Tick a cada segundo para atualizar o cronômetro ativo
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!activeSession) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [activeSession]);

  // `today` como valor estável (string) — não recomputa memos a cada render.
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayInRange = useMemo(() => isInRange(today, range), [today, range]);

  // INC-05: derivações pesadas em useMemo (deps reais) — NÃO recalculam a cada tick
  // do cronômetro (setTick) nem a cada poll do delta sync.
  const overdueTasks = useMemo(
    () => tasks.filter((t) => t.dueDate && t.dueDate < today && !["CONCLUIDA", "CANCELADA"].includes(t.status)),
    [tasks, today],
  );
  const overdueCount = overdueTasks.length;
  const overdueProjects = useMemo(() => new Set(overdueTasks.map((t) => t.projectId)).size, [overdueTasks]);

  const completedInPeriod = useMemo(() => tasks.filter((t) => isInRange(t.completedAt, range)).length, [tasks, range]);

  const periodLogs = useMemo(() => timeLogs.filter((tl) => isInRange(tl.date, range)), [timeLogs, range]);
  const periodLogsByTask = useMemo(
    () => periodLogs.reduce<Record<string, number>>((acc, tl) => {
      acc[tl.taskId] = (acc[tl.taskId] ?? 0) + tl.hours;
      return acc;
    }, {}),
    [periodLogs],
  );

  const taskById = useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);

  // Horas por task incluindo a sessão ativa (só conta o cronômetro se hoje está no período)
  const taskHoursInPeriod = (taskId: string): number => {
    const logged = periodLogsByTask[taskId] ?? 0;
    if (todayInRange && activeSession?.taskId === taskId) return logged + getElapsedSeconds() / 3600;
    return logged;
  };

  // Parte pesada memoizada (usa mapa de lookup); a soma da sessão ativa (live) é O(1).
  const basePeriodHoursByProject = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const [taskId, hours] of Object.entries(periodLogsByTask)) {
      const task = taskById.get(taskId);
      if (task) acc[task.projectId] = (acc[task.projectId] ?? 0) + hours;
    }
    return acc;
  }, [periodLogsByTask, taskById]);

  const periodHoursByProject: Record<string, number> = { ...basePeriodHoursByProject };
  if (todayInRange && activeSession) {
    const activeTask = taskById.get(activeSession.taskId);
    if (activeTask) {
      periodHoursByProject[activeTask.projectId] =
        (periodHoursByProject[activeTask.projectId] ?? 0) + getElapsedSeconds() / 3600;
    }
  }

  const myTasks = useMemo(
    () => (isAdmin
      ? tasks.filter((t) => ["EM_DESENVOLVIMENTO", "EM_REVISAO"].includes(t.status)).slice(0, 5)
      : tasks.filter((t) => t.assigneeId === user?.id).slice(0, 5)),
    [isAdmin, tasks, user?.id],
  );

  // Ranking de devs: passada única (era O(users × (tasks+projects)) a cada segundo).
  const devRanking = useMemo(() => {
    const hoursByUser = new Map<string, number>();
    for (const tl of periodLogs) hoursByUser.set(tl.userId, (hoursByUser.get(tl.userId) ?? 0) + tl.hours);
    const activeByUser = new Map<string, number>();
    const totalByUser = new Map<string, number>();
    for (const t of tasks) {
      totalByUser.set(t.assigneeId, (totalByUser.get(t.assigneeId) ?? 0) + 1);
      if (t.status === "EM_DESENVOLVIMENTO") activeByUser.set(t.assigneeId, (activeByUser.get(t.assigneeId) ?? 0) + 1);
    }
    const projectsByUser = new Map<string, number>();
    for (const p of projects) {
      for (const uid of new Set([p.ownerId, ...p.developerIds])) {
        projectsByUser.set(uid, (projectsByUser.get(uid) ?? 0) + 1);
      }
    }
    return users
      .map((u) => ({
        user: u,
        hours: hoursByUser.get(u.id) ?? 0,
        activeTasks: activeByUser.get(u.id) ?? 0,
        totalTasks: totalByUser.get(u.id) ?? 0,
        projectCount: projectsByUser.get(u.id) ?? 0,
      }))
      .filter((d) => d.hours > 0 || d.totalTasks > 0)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 6);
  }, [users, periodLogs, tasks, projects]);

  const maxHours = devRanking[0]?.hours || 1;

  return (
      <div className="p-4 sm:p-6 w-full space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">
              Olá, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <PeriodFilter
              value={range}
              onChange={setRange}
              activePreset={preset}
              onPresetChange={setPreset}
            />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-zinc-500">Sistema operacional</span>
            </div>
          </div>
        </div>

        {!hasLoaded ? (
          <PageLoading label="Carregando painel..." />
        ) : (
        <>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            title="Projetos Ativos" value={summary.activeProjects} subtitle={`de ${summary.totalProjects} total`}
            icon={FolderKanban} color="violet" delay={0.05} trend={8}
          />
          <StatCard
            title="Tarefas Abertas" value={summary.totalTasks - summary.completedTasks}
            subtitle={`${summary.completedTasks} concluídas`}
            icon={ListTodo} color="blue" delay={0.1}
          />
          <StatCard
            title="Concluídas" value={completedInPeriod}
            subtitle={`${range.label.toLowerCase()} · ${summary.completedTasks} no total`}
            icon={CheckCircle2} color="emerald" delay={0.15}
          />
          <StatCard
            title="Atrasadas" value={overdueCount}
            subtitle={overdueCount === 0 ? "tudo em dia ✓" : `${overdueProjects} projeto${overdueProjects !== 1 ? "s" : ""} afetado${overdueProjects !== 1 ? "s" : ""}`}
            icon={CalendarX} color={overdueCount === 0 ? "emerald" : "orange"} delay={0.18}
          />
          <StatCard
            title="Bloqueadas" value={summary.blockedTasks} subtitle="requer atenção"
            icon={AlertTriangle} color="red" delay={0.2} trend={-3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Gráfico burndown — largura reduzida */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-zinc-100">Burndown</h3>
              <p className="text-xs text-zinc-500">Últimas 2 semanas</p>
            </div>
            <MetricsAreaChart
              data={burndownData}
              xKey="date"
              height={190}
              series={[
                { key: "estimado", label: "Estimado", color: "#6366f1" },
                { key: "real", label: "Real", color: "#22c55e" },
              ]}
            />
          </motion.div>

          {/* Distribuição por Status */}
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
                      animate={{ width: `${(count / Math.max(summary.totalTasks, 1)) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="h-full bg-violet-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs text-zinc-400 w-5 text-right">{count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Ranking de Desenvolvedores */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Ranking de Horas
                </h3>
                <p className="text-xs text-zinc-500">Horas registradas · {range.label.toLowerCase()}</p>
              </div>
            </div>
            <div className="space-y-3">
              {devRanking.map(({ user: dev, hours, activeTasks, totalTasks, projectCount }, idx) => {
                const medalColors = ["text-amber-400", "text-zinc-300", "text-amber-600"];
                const barColors = ["bg-amber-500", "bg-zinc-400", "bg-amber-700", "bg-violet-500", "bg-blue-500", "bg-emerald-500"];
                return (
                  <motion.div
                    key={dev.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.06 }}
                    className="flex items-center gap-2.5"
                  >
                    {/* Posição */}
                    <div className="w-5 shrink-0 text-center">
                      {idx < 3 ? (
                        <Medal className={`w-4 h-4 mx-auto ${medalColors[idx]}`} />
                      ) : (
                        <span className="text-xs font-bold text-zinc-600">{idx + 1}</span>
                      )}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarImage src={dev.avatar} />
                      <AvatarFallback className="text-[9px] bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-bold">
                        {dev.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info + barra */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-zinc-200 truncate">{dev.name.split(" ")[0]}</span>
                        <span className="text-xs font-bold text-zinc-300 shrink-0 ml-1">{hours.toFixed(1)}h</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(hours / maxHours) * 100}%` }}
                          transition={{ duration: 0.7, delay: 0.5 + idx * 0.06 }}
                          className={`h-full rounded-full ${barColors[idx] ?? "bg-violet-500"}`}
                        />
                      </div>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[9px] text-zinc-600">{projectCount} proj.</span>
                        <span className="text-[9px] text-zinc-600">{totalTasks} tar.</span>
                        {activeTasks > 0 && (
                          <span className="text-[9px] text-violet-400">{activeTasks} ativo(s)</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {devRanking.length === 0 && (
                <p className="text-xs text-zinc-600 text-center py-4">Nenhuma hora registrada ainda</p>
              )}
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
                {isAdmin ? "Tarefas em Andamento" : "Minhas Tarefas"}
              </h3>
              <Link href="/tasks" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                Ver todas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {/* Legenda */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800/50">
              <span className="text-[10px] text-zinc-600 uppercase tracking-wide">Tarefa</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3 h-3" /> {hoursColLabel}
              </span>
            </div>
            <div className="space-y-1.5">
              {myTasks.length === 0 && (
                <p className="text-xs text-zinc-600 text-center py-6">Nenhuma tarefa em andamento</p>
              )}
              {myTasks.map((task) => {
                const assignee = users.find((u) => u.id === task.assigneeId);
                const hoursToday = taskHoursInPeriod(task.id);
                const isActive = activeSession?.taskId === task.id;
                const hoursDisplay = hoursToday >= 0.017
                  ? hoursToday >= 1 ? `${hoursToday.toFixed(1)}h` : `${Math.round(hoursToday * 60)}m`
                  : null;
                const isOverdue = task.dueDate && task.dueDate < today;
                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors group ${
                      isActive
                        ? "bg-violet-500/8 hover:bg-violet-500/12 border border-violet-500/20"
                        : "bg-zinc-800/30 hover:bg-zinc-800/60"
                    }`}
                  >
                    {isActive
                      ? <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                      : <Circle className="w-2.5 h-2.5 text-zinc-600 shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate group-hover:text-white ${isActive ? "text-violet-200 font-medium" : "text-zinc-200"}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge status={task.status} className="text-[9px] px-1 py-0" />
                        {isOverdue && (
                          <span className="text-[9px] text-orange-400 font-medium">atrasada</span>
                        )}
                        <span className="text-[10px] text-zinc-600">{assignee?.name?.split(" ")[0]}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {hoursDisplay ? (
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-xs tabular-nums ${
                          isActive ? "bg-violet-500/20 text-violet-300" : "bg-zinc-700/60 text-zinc-300"
                        }`}>
                          {isActive && <Timer className="w-2.5 h-2.5 animate-pulse" />}
                          {hoursDisplay}
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-700">—</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            {myTasks.length > 0 && (
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/50">
                <span className="text-[10px] text-zinc-600">{totalLabel}</span>
                <span className="text-xs font-bold text-zinc-300 tabular-nums">
                  {(() => {
                    const total = myTasks.reduce((acc, t) => acc + taskHoursInPeriod(t.id), 0);
                    return total >= 1 ? `${total.toFixed(1)}h` : total > 0 ? `${Math.round(total * 60)}m` : "0h";
                  })()}
                </span>
              </div>
            )}
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
            {/* Legenda */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-zinc-800/50">
              <span className="text-[10px] text-zinc-600 uppercase tracking-wide">Projeto</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3 h-3" /> {hoursColLabel}
              </span>
            </div>
            <div className="space-y-2">
              {projects.slice(0, 4).map((project) => {
                const hoursToday = periodHoursByProject[project.id] ?? 0;
                const activeTask = activeSession ? taskById.get(activeSession.taskId) : undefined;
                const hasActiveTask = !!activeTask && activeTask.projectId === project.id;
                const hoursDisplay = hoursToday >= 0.017
                  ? hoursToday >= 1 ? `${hoursToday.toFixed(1)}h` : `${Math.round(hoursToday * 60)}m`
                  : null;
                const projectTasksTodayCount = tasks.filter(
                  (t) => t.projectId === project.id && (periodLogsByTask[t.id] || (hasActiveTask && t.id === activeSession?.taskId))
                ).length;
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className={`block p-2.5 rounded-lg transition-colors group ${
                      hasActiveTask ? "bg-violet-500/5 border border-violet-500/15 hover:bg-violet-500/10" : "hover:bg-zinc-800/30"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: project.color }} />
                      <p className="text-sm text-zinc-200 truncate flex-1 group-hover:text-white">{project.name}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        {hoursDisplay ? (
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-xs tabular-nums ${
                            hasActiveTask ? "bg-violet-500/20 text-violet-300" : "bg-zinc-700/50 text-zinc-400"
                          }`}>
                            {hasActiveTask && <Timer className="w-2.5 h-2.5 animate-pulse" />}
                            {hoursDisplay}
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-700">—</span>
                        )}
                        <span className="text-xs text-zinc-500">{project.progress}%</span>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-1 bg-zinc-800" />
                    {projectTasksTodayCount > 0 && (
                      <p className="text-[10px] text-zinc-600 mt-1">
                        {projectTasksTodayCount} tarefa{projectTasksTodayCount > 1 ? "s" : ""} com horas hoje
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
            {Object.keys(periodHoursByProject).length > 0 && (
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/50">
                <span className="text-[10px] text-zinc-600">{totalLabel}</span>
                <span className="text-xs font-bold text-zinc-300 tabular-nums">
                  {(() => {
                    const total = Object.values(periodHoursByProject).reduce((a, b) => a + b, 0);
                    return total >= 1 ? `${total.toFixed(1)}h` : `${Math.round(total * 60)}m`;
                  })()}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Precisão de Estimativa" value={`${summary.estimationAccuracy}%`} subtitle="acurácia das estimativas" icon={TrendingUp} color="emerald" delay={0.45} />
          <StatCard title="Tempo de Espera" value={`${summary.averageLeadTime}d`} subtitle="do início ao fim médio" icon={Clock} color="blue" delay={0.5} />
          <StatCard title="Tempo de Ciclo" value={`${summary.averageCycleTime}d`} subtitle="do dev à conclusão" icon={Zap} color="amber" delay={0.55} />
          <StatCard title="Entregas / Semana" value={`${summary.throughput}`} subtitle="tarefas concluídas" icon={Users} color="violet" delay={0.6} />
        </div>
        </>
        )}
      </div>
  );
}
