"use client";

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useTaskStore, useProjectStore } from "@/stores";
import { StatusBadge } from "@/components/shared/task-badge";
import { formatDate } from "@/lib/utils";
import { motion } from "@/lib/motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  BACKLOG: "#52525b",
  PLANEJADA: "#3b82f6",
  BLOQUEADA: "#ef4444",
  EM_DESENVOLVIMENTO: "#8b5cf6",
  EM_REVISAO: "#f59e0b",
  HOMOLOGACAO: "#06b6d4",
  CONCLUIDA: "#22c55e",
  CANCELADA: "#3f3f46",
};

const MONTH_NAMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function GanttPage() {
  const { tasks } = useTaskStore();
  const { projects, getProjectById } = useProjectStore();
  const [projectFilter, setProjectFilter] = useState("all");
  const [baseYear, setBaseYear] = useState(new Date().getFullYear());

  const visibleTasks = useMemo(() => {
    const filtered = projectFilter === "all" ? tasks : tasks.filter((t) => t.projectId === projectFilter);
    return filtered.filter((t) => t.startDate || t.dueDate).sort((a, b) => {
      const aDate = a.startDate ?? a.dueDate ?? "";
      const bDate = b.startDate ?? b.dueDate ?? "";
      return aDate.localeCompare(bDate);
    });
  }, [tasks, projectFilter]);

  const months = useMemo(() => {
    return MONTH_NAMES.map((name, i) => ({ name, index: i }));
  }, []);

  const getBarPosition = (task: Task) => {
    const startDate = task.startDate ? new Date(task.startDate) : new Date(task.createdAt);
    const endDate = task.dueDate ? new Date(task.dueDate) : new Date(task.completedAt ?? new Date());

    const yearStart = new Date(baseYear, 0, 1);
    const yearEnd = new Date(baseYear, 11, 31);
    const totalDays = 365;

    const taskStart = Math.max(startDate.getTime(), yearStart.getTime());
    const taskEnd = Math.min(endDate.getTime(), yearEnd.getTime());

    if (taskEnd < yearStart.getTime() || taskStart > yearEnd.getTime()) return null;

    const startOffset = Math.max(0, (taskStart - yearStart.getTime()) / (1000 * 60 * 60 * 24));
    const duration = Math.max(1, (taskEnd - taskStart) / (1000 * 60 * 60 * 24));

    const left = (startOffset / totalDays) * 100;
    const width = Math.min((duration / totalDays) * 100, 100 - left);

    return { left, width };
  };

  const today = new Date();
  const todayOffset = (() => {
    if (today.getFullYear() !== baseYear) return null;
    const yearStart = new Date(baseYear, 0, 1);
    const diff = (today.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24);
    return (diff / 365) * 100;
  })();

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
          <div>
            <h1 className="text-lg font-bold text-zinc-100">Timeline / Gantt</h1>
            <p className="text-xs text-zinc-500">{visibleTasks.length} tarefa{visibleTasks.length !== 1 ? "s" : ""} com datas definidas</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button onClick={() => setBaseYear((y) => y - 1)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-zinc-200 w-12 text-center">{baseYear}</span>
              <button onClick={() => setBaseYear((y) => y + 1)} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <Select value={projectFilter} onValueChange={(value) => setProjectFilter(value ?? "all")}>
              <SelectTrigger className="w-44 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700/50">
                <SelectItem value="all">Todos os projetos</SelectItem>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="min-w-[900px]">
            <div className="flex sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/50">
              <div className="w-64 shrink-0 px-4 py-2.5 border-r border-zinc-800/50">
                <span className="text-xs font-semibold text-zinc-500">Tarefa</span>
              </div>
              <div className="flex-1 flex relative">
                {months.map((month) => (
                  <div key={month.index} className="flex-1 text-center py-2.5 text-xs font-medium text-zinc-500 border-r border-zinc-800/30 last:border-r-0">
                    {month.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="divide-y divide-zinc-800/30">
              {visibleTasks.map((task, i) => {
                const barPos = getBarPosition(task);
                const project = getProjectById(task.projectId);

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center hover:bg-zinc-900/40 transition-colors"
                  >
                    <div className="w-64 shrink-0 px-4 py-3 border-r border-zinc-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        {project && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: project.color }} />}
                        <span className="text-xs text-zinc-200 truncate">{task.title}</span>
                      </div>
                      <StatusBadge status={task.status} className="text-[9px] px-1 py-0" />
                    </div>

                    <div className="flex-1 relative h-12 flex items-center">
                      {months.map((month) => (
                        <div key={month.index} className="absolute h-full border-r border-zinc-800/20" style={{ left: `${(month.index / 12) * 100}%` }} />
                      ))}

                      {todayOffset !== null && (
                        <div
                          className="absolute top-0 bottom-0 w-px bg-violet-500/60 z-10"
                          style={{ left: `${todayOffset}%` }}
                        />
                      )}

                      {barPos && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.4, delay: i * 0.02 }}
                          style={{
                            position: "absolute",
                            left: `${barPos.left}%`,
                            width: `${barPos.width}%`,
                            transformOrigin: "left",
                            background: STATUS_COLORS[task.status] ?? "#6366f1",
                            borderRadius: "6px",
                            height: "24px",
                          }}
                          className="flex items-center px-2 overflow-hidden group"
                        >
                          <span className="text-[10px] text-white font-medium truncate opacity-80">{task.title}</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {visibleTasks.length === 0 && (
                <div className="flex items-center justify-center py-20 text-zinc-500 text-sm">
                  Nenhuma tarefa com data definida encontrada
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 py-3 border-t border-zinc-800/50 flex-wrap">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded" style={{ background: color }} />
              <span className="text-[10px] text-zinc-500">{status.replace("_", " ")}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-0.5 h-3 bg-violet-500/60" />
            <span className="text-[10px] text-zinc-500">Hoje</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
