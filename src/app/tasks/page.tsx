"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, ALL_STATUSES, getStatusLabel, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ListTodo, Filter, Plus, Search, ChevronDown, Clock, AlertTriangle, Timer, Lock, Flame } from "lucide-react";
import { useWorkSessionStore } from "@/stores/work-session-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { TaskStatus } from "@/types";
import { TaskCreateDialog } from "@/features/tasks/task-create-dialog";

export default function TasksPage() {
  const { tasks, getBlockersForTask } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const { user, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { activeSession } = useWorkSessionStore();

  const visibleTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (!isAdmin && t.assigneeId !== user?.id) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (projectFilter !== "all" && t.projectId !== projectFilter) return false;
      return true;
    });
  }, [tasks, search, statusFilter, projectFilter, isAdmin, user]);

  const visibleProjects = isAdmin ? projects : projects.filter((p) => p.developerIds.includes(user?.id ?? "") || p.ownerId === user?.id);

  return (
    <AppLayout>
      <PageHeader
        title="Tarefas"
        description={`${visibleTasks.length} tarefa${visibleTasks.length !== 1 ? "s" : ""}`}
        actions={isAdmin ? [{ label: "Nova Tarefa", onClick: () => setIsCreateOpen(true) }] : undefined}
      />

      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar tarefas..."
              className="pl-9 bg-zinc-800/50 border-zinc-700/50 text-zinc-100 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value ?? "all")}>
            <SelectTrigger className="w-44 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50">
              <SelectItem value="all">Todos os status</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={projectFilter} onValueChange={(value) => setProjectFilter(value ?? "all")}>
            <SelectTrigger className="w-48 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
              <SelectValue placeholder="Projeto" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700/50">
              <SelectItem value="all">Todos os projetos</SelectItem>
              {visibleProjects.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {visibleTasks.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="Nenhuma tarefa encontrada"
            description="Tente ajustar os filtros ou crie uma nova tarefa."
            action={isAdmin ? { label: "Criar Tarefa", onClick: () => setIsCreateOpen(true) } : undefined}
          />
        ) : (
          <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/50">
                  <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3">Tarefa</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden md:table-cell">Status</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden lg:table-cell">Projeto</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden lg:table-cell">Responsável</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden xl:table-cell">Complexidade</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden xl:table-cell">Prazo</th>
                  <th className="text-left text-xs font-semibold text-zinc-500 px-4 py-3 hidden xl:table-cell">Horas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/30">
                {visibleTasks.map((task, i) => {
                  const assignee = users.find((u) => u.id === task.assigneeId);
                  const project = projects.find((p) => p.id === task.projectId);
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "CONCLUIDA";
                  const isBeingWorked = activeSession?.taskId === task.id;

                  return (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={cn(
                        "transition-colors",
                        isBeingWorked
                          ? "bg-violet-500/5 hover:bg-violet-500/8"
                          : "hover:bg-zinc-800/30"
                      )}
                    >
                      <td className="px-4 py-3">
                        <Link href={`/tasks/${task.id}`} className="group">
                          <div className="flex items-center gap-2">
                            {isBeingWorked && (
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
                            )}
                            {task.isUrgent && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[9px] font-bold text-red-400 shrink-0">
                                <Flame className="w-2.5 h-2.5" /> URGENTE
                              </span>
                            )}
                            {task.urgentBlockedById && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/25 text-[9px] font-semibold text-orange-400 shrink-0">
                                <Lock className="w-2.5 h-2.5" /> urgência
                              </span>
                            )}
                            {!task.isUrgent && !task.urgentBlockedById && (() => {
                              const blockers = getBlockersForTask(task.id);
                              return blockers.length > 0 ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/25 text-[9px] font-semibold text-red-400 shrink-0">
                                  <Lock className="w-2.5 h-2.5" />{blockers.length}
                                </span>
                              ) : task.status === "BLOQUEADA" && !isBeingWorked ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              ) : null;
                            })()}
                            <span className={cn(
                              "text-sm transition-colors line-clamp-1",
                              isBeingWorked
                                ? "text-violet-200 group-hover:text-violet-100 font-medium"
                                : "text-zinc-200 group-hover:text-violet-400"
                            )}>
                              {task.title}
                            </span>
                            {isBeingWorked && (
                              <span className="ml-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-500/20 border border-violet-500/30">
                                <Timer className="w-2.5 h-2.5 text-violet-400" />
                                <span className="text-[9px] font-semibold text-violet-300">Ativo</span>
                              </span>
                            )}
                          </div>
                          {task.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {task.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded">{tag}</span>
                              ))}
                            </div>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {project && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ background: project.color }} />
                            <span className="text-xs text-zinc-400 truncate max-w-28">{project.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={assignee?.avatar} />
                            <AvatarFallback className="text-[9px] bg-zinc-700">{assignee?.name?.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-zinc-400 hidden xl:block">{assignee?.name?.split(" ")[0]}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <ComplexityBadge complexity={task.complexity} />
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className={`text-xs ${isOverdue ? "text-red-400 font-semibold" : "text-zinc-500"}`}>
                          {formatDate(task.dueDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <div className="flex items-center gap-1 text-xs">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          <span className="text-zinc-400">{task.actualHours}/{task.estimatedHours}h</span>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && <TaskCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />}
    </AppLayout>
  );
}
