"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useTaskStore, useProjectStore } from "@/stores";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { motion } from "@/lib/motion";
import { Network, AlertTriangle, CheckCircle2, ArrowRight, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "@/lib/router";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DependenciesPage() {
  const { tasks, dependencies } = useTaskStore();
  const { projects } = useProjectStore();
  const [projectFilter, setProjectFilter] = useState("all");

  const visibleTasks = projectFilter === "all" ? tasks : tasks.filter((t) => t.projectId === projectFilter);
  const visibleDeps = dependencies.filter((dep) => {
    if (projectFilter === "all") return true;
    const task = tasks.find((t) => t.id === dep.taskId);
    return task?.projectId === projectFilter;
  });

  const blockedTasksWithDeps = visibleTasks.filter((t) => (t.dependencyIds ?? []).length > 0 || t.status === "BLOQUEADA");

  return (
    <AppLayout>
      <div className="p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Dependências entre Tarefas</h1>
            <p className="text-sm text-zinc-500">{visibleDeps.length} dependências encontradas</p>
          </div>
          <Select value={projectFilter} onValueChange={(value) => setProjectFilter(value ?? "all")}>
            <SelectTrigger className="w-48 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50">
              <SelectItem value="all">Todos os projetos</SelectItem>
              {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total de Dependências", value: visibleDeps.length, color: "text-zinc-200", icon: Network },
            { label: "Tarefas Bloqueadas", value: visibleTasks.filter((t) => t.status === "BLOQUEADA").length, color: "text-red-400", icon: AlertTriangle },
            { label: "Dependências Resolvidas", value: visibleDeps.filter((d) => {
              const depTask = tasks.find((t) => t.id === d.dependsOnTaskId);
              return depTask?.status === "CONCLUIDA" || depTask?.status === "CANCELADA";
            }).length, color: "text-emerald-400", icon: CheckCircle2 },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {visibleDeps.map((dep, i) => {
            const task = tasks.find((t) => t.id === dep.taskId);
            const depTask = tasks.find((t) => t.id === dep.dependsOnTaskId);
            if (!task || !depTask) return null;

            const isResolved = depTask.status === "CONCLUIDA" || depTask.status === "CANCELADA";
            const isBlocking = !isResolved && task.status === "BLOQUEADA";

            return (
              <motion.div
                key={dep.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`bg-zinc-900/60 border rounded-xl p-4 ${
                  isBlocking ? "border-red-500/30" : isResolved ? "border-emerald-500/20" : "border-zinc-800/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <Link2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isBlocking ? "text-red-400" : isResolved ? "text-emerald-400" : "text-zinc-500"
                  }`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Link href={`/tasks/${task.id}`}>
                        <span className="text-sm font-medium text-zinc-200 hover:text-violet-400 transition-colors">{task.title}</span>
                      </Link>
                      <StatusBadge status={task.status} className="text-[9px]" />
                      <ComplexityBadge complexity={task.complexity} />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        dep.type === "BLOCKED_BY" ? "bg-red-500/15 text-red-400" : "bg-blue-500/15 text-blue-400"
                      }`}>
                        {dep.type === "BLOCKED_BY" ? "BLOQUEADA POR" : dep.type === "BLOCKS" ? "BLOQUEIA" : "RELACIONADA"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                      <Link href={`/tasks/${depTask.id}`}>
                        <span className="text-sm text-zinc-300 hover:text-violet-400 transition-colors">{depTask.title}</span>
                      </Link>
                      <StatusBadge status={depTask.status} className="text-[9px]" />
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isResolved ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-medium">Resolvida</span>
                      </div>
                    ) : isBlocking ? (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-red-500/15 rounded-full">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span className="text-[10px] text-red-400 font-medium">Bloqueando</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/15 rounded-full">
                        <span className="text-[10px] text-amber-400 font-medium">Pendente</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {visibleDeps.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Network className="w-10 h-10 text-zinc-600 mb-3" />
              <p className="text-sm font-medium text-zinc-400">Nenhuma dependência encontrada</p>
              <p className="text-xs text-zinc-600 mt-1">Dependências entre tarefas serão exibidas aqui</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
