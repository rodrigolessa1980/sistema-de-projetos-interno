"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useTaskStore, useProjectStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { useWorkSessionStore } from "@/stores/work-session-store";
import { StatusBadge } from "@/components/shared/task-badge";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Inbox, Clock, CheckCircle2, AlertTriangle, Timer,
  Circle, Zap, ChevronDown, CalendarClock, Play,
  CalendarX, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task, Project } from "@/types";

function hoursDisplay(h: number) {
  if (h < 0.017) return null;
  return h >= 1 ? `${h.toFixed(1)}h` : `${Math.round(h * 60)}m`;
}

function TaskRow({
  task,
  projects,
  isActive,
  elapsedSeconds,
  todayHours,
}: {
  task: Task;
  projects: Project[];
  isActive: boolean;
  elapsedSeconds: number;
  todayHours: number;
}) {
  const project = projects.find((p) => p.id === task.projectId);
  const today = new Date().toISOString().split("T")[0];
  const isOverdue = task.dueDate && task.dueDate < today && !["CONCLUIDA", "CANCELADA"].includes(task.status);
  const totalHoursToday = todayHours + (isActive ? elapsedSeconds / 3600 : 0);
  const display = hoursDisplay(totalHoursToday);

  return (
    <Link
      href={`/tasks/${task.id}`}
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-lg transition-colors group",
        isActive
          ? "bg-violet-500/8 border border-violet-500/20 hover:bg-violet-500/12"
          : "bg-zinc-800/30 hover:bg-zinc-800/60"
      )}
    >
      {isActive
        ? <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shrink-0" />
        : <Circle className="w-2.5 h-2.5 text-zinc-600 shrink-0" />
      }

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm truncate group-hover:text-white",
          isActive ? "text-violet-200 font-medium" : "text-zinc-200",
          task.isUrgent && "text-orange-200"
        )}>
          {task.isUrgent && <Zap className="inline w-3 h-3 text-orange-400 mr-1 -mt-0.5" />}
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <StatusBadge status={task.status} className="text-[9px] px-1 py-0" />
          {project && (
            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: project.color }} />
              {project.name}
            </span>
          )}
          {task.dueDate && (
            <span className={cn(
              "text-[10px]",
              isOverdue ? "text-orange-400 font-medium" : "text-zinc-600"
            )}>
              {isOverdue ? "atrasada · " : ""}
              {new Date(task.dueDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 text-right flex items-center gap-2">
        <div>
          {display ? (
            <div className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-xs tabular-nums",
              isActive ? "bg-violet-500/20 text-violet-300" : "bg-zinc-700/60 text-zinc-300"
            )}>
              {isActive && <Timer className="w-2.5 h-2.5 animate-pulse" />}
              {display}
            </div>
          ) : (
            <span className="text-[11px] text-zinc-700">
              {task.actualHours > 0 ? `${task.actualHours}h` : "—"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function Section({
  title,
  count,
  color,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  count: number;
  color: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-zinc-800/30 transition-colors text-left"
      >
        <Icon className={cn("w-4 h-4 shrink-0", color)} />
        <span className="text-sm font-semibold text-zinc-200 flex-1">{title}</span>
        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", color === "text-orange-400" ? "bg-orange-500/15 text-orange-400" : color === "text-blue-400" ? "bg-blue-500/15 text-blue-400" : color === "text-amber-400" ? "bg-amber-500/15 text-amber-400" : color === "text-emerald-400" ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-700 text-zinc-400")}>
          {count}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform shrink-0", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MyQueuePage() {
  const { user, isLoading } = useAuth();
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { activeSession, getElapsedSeconds } = useWorkSessionStore();

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!activeSession) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [activeSession]);

  if (isLoading) return null;

  const today = new Date().toISOString().split("T")[0];
  const in3Days = new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];

  const myTasks = tasks.filter((t) => t.assigneeId === user?.id);

  // Horas hoje por tarefa
  const todayHoursByTask = timeLogs
    .filter((tl) => tl.userId === user?.id && tl.date === today)
    .reduce<Record<string, number>>((acc, tl) => {
      acc[tl.taskId] = (acc[tl.taskId] ?? 0) + tl.hours;
      return acc;
    }, {});

  const elapsedSec = activeSession ? getElapsedSeconds() : 0;

  // Stats
  const hoursToday = Object.values(todayHoursByTask).reduce((a, b) => a + b, 0) + elapsedSec / 3600;
  const weekStart = (() => {
    const d = new Date(); d.setDate(d.getDate() - d.getDay()); return d.toISOString().split("T")[0];
  })();
  const hoursWeek = timeLogs.filter((tl) => tl.userId === user?.id && tl.date >= weekStart).reduce((a, tl) => a + tl.hours, 0) + elapsedSec / 3600;

  // Seções
  const urgentTask = myTasks.find((t) => t.isUrgent && !["CONCLUIDA", "CANCELADA"].includes(t.status));

  const overdueTasks = myTasks.filter(
    (t) => t.dueDate && t.dueDate < today && !["CONCLUIDA", "CANCELADA"].includes(t.status) && !t.isUrgent
  );

  const activeTasks = myTasks.filter(
    (t) =>
      ["EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO"].includes(t.status) &&
      !t.isUrgent &&
      !(t.dueDate && t.dueDate < today)
  );

  const dueSoonTasks = myTasks.filter(
    (t) =>
      t.dueDate && t.dueDate >= today && t.dueDate <= in3Days &&
      ["BACKLOG", "PLANEJADA", "BLOQUEADA"].includes(t.status)
  );

  const pendingTasks = myTasks.filter(
    (t) =>
      ["BACKLOG", "PLANEJADA", "BLOQUEADA"].includes(t.status) &&
      !(t.dueDate && t.dueDate >= today && t.dueDate <= in3Days)
  );

  const recentDone = myTasks.filter(
    (t) => t.status === "CONCLUIDA" && t.completedAt && t.completedAt >= weekAgo
  );

  const activeTask = activeSession ? tasks.find((t) => t.id === activeSession.taskId) : null;
  const activeProject = activeTask ? projects.find((p) => p.id === activeTask.projectId) : null;

  return (
    <AppLayout>
      <div className="p-6 w-full space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-violet-400" />
              Minha Fila
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {user?.name} · {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          {/* Stats chips */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="flex items-center gap-1.5 bg-zinc-800/60 rounded-lg px-3 py-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-semibold text-zinc-200 tabular-nums">
                {hoursDisplay(hoursToday) ?? "0h"} hoje
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-800/60 rounded-lg px-3 py-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-zinc-200 tabular-nums">
                {hoursDisplay(hoursWeek) ?? "0h"} esta semana
              </span>
            </div>
            {overdueTasks.length > 0 && (
              <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1.5">
                <CalendarX className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-semibold text-orange-300">
                  {overdueTasks.length} atrasada{overdueTasks.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sessão ativa */}
        {activeSession && activeTask && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/25 rounded-xl px-4 py-3"
          >
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-violet-200 truncate">{activeTask.title}</p>
              <p className="text-[11px] text-violet-400/70 mt-0.5">
                {activeProject?.name} · em andamento
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-violet-500/20 rounded-md px-2.5 py-1 tabular-nums text-xs font-bold text-violet-300">
              <Timer className="w-3 h-3 animate-pulse" />
              {(() => {
                const s = elapsedSec;
                const h = Math.floor(s / 3600);
                const m = Math.floor((s % 3600) / 60);
                const sec = Math.floor(s % 60);
                return h > 0
                  ? `${h}h ${String(m).padStart(2, "0")}m`
                  : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
              })()}
            </div>
            <Link
              href={`/tasks/${activeTask.id}`}
              className="text-xs text-violet-400 hover:text-violet-300 font-medium whitespace-nowrap"
            >
              Ver tarefa →
            </Link>
          </motion.div>
        )}

        {/* Tarefa urgente */}
        {urgentTask && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-500/8 border border-orange-500/30 rounded-xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-orange-500/20">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-300">Tarefa Urgente</span>
            </div>
            <div className="px-3 py-2.5">
              <TaskRow
                task={urgentTask}
                projects={projects}
                isActive={activeSession?.taskId === urgentTask.id}
                elapsedSeconds={elapsedSec}
                todayHours={todayHoursByTask[urgentTask.id] ?? 0}
              />
            </div>
          </motion.div>
        )}

        {/* Seções de tarefas */}
        <div className="space-y-3">
          <Section title="Atrasadas" count={overdueTasks.length} color="text-orange-400" icon={CalendarX}>
            {overdueTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                projects={projects}
                isActive={activeSession?.taskId === task.id}
                elapsedSeconds={elapsedSec}
                todayHours={todayHoursByTask[task.id] ?? 0}
              />
            ))}
          </Section>

          <Section title="Em Andamento" count={activeTasks.length} color="text-blue-400" icon={Play}>
            {activeTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                projects={projects}
                isActive={activeSession?.taskId === task.id}
                elapsedSeconds={elapsedSec}
                todayHours={todayHoursByTask[task.id] ?? 0}
              />
            ))}
          </Section>

          <Section title="Vence em breve" count={dueSoonTasks.length} color="text-amber-400" icon={CalendarClock}>
            {dueSoonTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                projects={projects}
                isActive={activeSession?.taskId === task.id}
                elapsedSeconds={elapsedSec}
                todayHours={todayHoursByTask[task.id] ?? 0}
              />
            ))}
          </Section>

          <Section title="Aguardando" count={pendingTasks.length} color="text-zinc-400" icon={Circle} defaultOpen={false}>
            {pendingTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                projects={projects}
                isActive={activeSession?.taskId === task.id}
                elapsedSeconds={elapsedSec}
                todayHours={todayHoursByTask[task.id] ?? 0}
              />
            ))}
          </Section>

          <Section title="Concluídas esta semana" count={recentDone.length} color="text-emerald-400" icon={CheckCircle2} defaultOpen={false}>
            {recentDone.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                projects={projects}
                isActive={false}
                elapsedSeconds={0}
                todayHours={0}
              />
            ))}
          </Section>
        </div>

        {/* Estado vazio */}
        {myTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Inbox className="w-10 h-10 text-zinc-700 mb-3" />
            <p className="text-sm font-medium text-zinc-500">Nenhuma tarefa atribuída a você</p>
            <p className="text-xs text-zinc-600 mt-1">Quando tarefas forem atribuídas, elas aparecerão aqui</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
