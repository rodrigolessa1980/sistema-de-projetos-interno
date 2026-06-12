"use client";

import { useState } from "react";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { formatDate, formatDateTime, formatRelativeTime, getStatusLabel, ALL_STATUSES } from "@/lib/utils";
import { motion, AnimatePresence } from "@/lib/motion";
import {
  ChevronLeft, Clock, AlertTriangle, MessageSquare, CheckSquare,
  Square, Plus, Send, Calendar, User2, Layers, Timer, Activity,
  Link2, Lock, CheckCircle2, ArrowRight, X, Flame, ShieldAlert,
} from "lucide-react";
import { ReassignPopover } from "@/components/shared/reassign-popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notFound, useParams } from "@/lib/router";
import Link from "@/lib/router";
import { toast } from "sonner";
import type { TaskStatus } from "@/types";
import { useTask, useUpdateTaskStatus, useLogTime } from "@/hooks/use-tasks";
import { WorkTimer } from "@/components/shared/work-timer";
import { NotesPanel } from "@/features/tasks/notes-panel";
import { AttachmentsPanel } from "@/features/tasks/attachments-panel";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getTaskById, getSubtasksByTask, getCommentsByTask, getTimeLogsByTask, addComment, toggleSubtask, addSubtask, getDependenciesByTask, updateTask, getBlockersForTask, tasks, addDependency, removeDependency, dependencies, setTaskUrgent } = useTaskStore();
  const { getProjectById } = useProjectStore();
  const { users } = useUserStore();
  const { user, isAdmin } = useAuth();
  const updateStatus = useUpdateTaskStatus();
  const logTimeMutation = useLogTime();
  useTask(id);

  const [commentText, setCommentText] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [logHours, setLogHours] = useState("");
  const [logDesc, setLogDesc] = useState("");

  const [depSearch, setDepSearch] = useState("");

  const task = getTaskById(id);
  if (!task) notFound();

  const project = getProjectById(task.projectId);
  const assignee = users.find((u) => u.id === task.assigneeId);
  const reporter = users.find((u) => u.id === task.reporterId);
  const subtasks = getSubtasksByTask(id);
  const comments = getCommentsByTask(id);
  const timeLogs = getTimeLogsByTask(id);
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const tags = task.tags ?? [];

  // Dependências desta tarefa (o que ela depende) — type BLOCKED_BY
  const myDeps = getDependenciesByTask(id).filter((d) => d.taskId === id && d.type === "BLOCKED_BY");
  const blockerTasks = myDeps.map((d) => tasks.find((t) => t.id === d.dependsOnTaskId)).filter(Boolean) as import("@/types").Task[];
  const pendingBlockers = blockerTasks.filter((t) => t.status !== "CONCLUIDA" && t.status !== "CANCELADA");
  const isBlocked = pendingBlockers.length > 0;

  // Tarefas que dependem desta (ela bloqueia outras)
  const blocksOthers = getDependenciesByTask(id).filter((d) => d.dependsOnTaskId === id && d.type === "BLOCKED_BY");
  const blockedByMe = blocksOthers.map((d) => tasks.find((t) => t.id === d.taskId)).filter(Boolean) as import("@/types").Task[];

  // Tarefas disponíveis para adicionar como dependência
  const availableToAdd = tasks.filter(
    (t) => t.projectId === task.projectId && t.id !== id && !myDeps.some((d) => d.dependsOnTaskId === t.id)
  );
  const filteredAvailable = depSearch.trim()
    ? availableToAdd.filter((t) => t.title.toLowerCase().includes(depSearch.toLowerCase()))
    : availableToAdd;

  const BLOCKED_STATUSES: TaskStatus[] = ["EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA"];

  const handleStatusChange = async (status: TaskStatus | null) => {
    if (!status) return;
    try {
      await updateStatus.mutateAsync({ taskId: id, status, userId: user?.id ?? "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao alterar status";
      toast.error(message);
    }
  };

  async function handleAddDep(depTaskId: string) {
    const depTask = tasks.find((t) => t.id === depTaskId);
    if (!depTask) return;
    await addDependency({ taskId: id, dependsOnTaskId: depTaskId, type: "BLOCKED_BY" });
    const isPending = depTask.status !== "CONCLUIDA" && depTask.status !== "CANCELADA";
    if (isPending) {
      await updateTask(id, {
        status: "BLOQUEADA",
        blockedReason: `Aguardando conclusão de: "${depTask.title}"`,
      });
      toast.warning(`Tarefa bloqueada por "${depTask.title}"`);
    } else {
      toast.success("Dependência adicionada");
    }
    setDepSearch("");
  }

  async function handleRemoveDep(depRecord: import("@/types").TaskDependency) {
    await removeDependency(depRecord.id);
    // Se não há mais bloqueadores pendentes, desbloqueia a tarefa
    const remaining = myDeps.filter((d) => d.id !== depRecord.id);
    const stillBlocked = remaining.some((d) => {
      const t = tasks.find((tt) => tt.id === d.dependsOnTaskId);
      return t && t.status !== "CONCLUIDA" && t.status !== "CANCELADA";
    });
    const currentTask = getTaskById(id);
    if (!stillBlocked && currentTask?.status === "BLOQUEADA") {
      await updateTask(id, { status: "PLANEJADA", blockedReason: undefined });
      toast.success("Dependência removida — tarefa desbloqueada");
    } else {
      toast.success("Dependência removida");
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    await addComment({ taskId: id, userId: user?.id ?? "", content: commentText, mentions: [] });
    setCommentText("");
    toast.success("Comentário adicionado");
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    await addSubtask({ taskId: id, title: newSubtask, completed: false, assigneeId: user?.id });
    setNewSubtask("");
  };

  const handleLogTime = async () => {
    const hours = parseFloat(logHours);
    if (!hours || hours <= 0) { toast.error("Informe um valor válido de horas"); return; }
    await logTimeMutation.mutateAsync({
      taskId: id, projectId: task.projectId, userId: user?.id ?? "", hours, description: logDesc,
      date: new Date().toISOString().split("T")[0], status: task.status,
    });
    setLogHours(""); setLogDesc("");
  };

  const progressPercent = task.estimatedHours > 0 ? Math.min(100, (task.actualHours / task.estimatedHours) * 100) : 0;

  return (
      <div className="p-6 w-full">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/tasks" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300">
            <ChevronLeft className="w-4 h-4" /> Tarefas
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-zinc-400 truncate">{task.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <StatusBadge status={task.status} />
                    <ComplexityBadge complexity={task.complexity} />
                    {task.isUrgent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[10px] font-bold text-red-400">
                        <Flame className="w-3 h-3" /> URGENTE
                      </span>
                    )}
                    {tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">{tag}</span>
                    ))}
                  </div>
                  <h1 className="text-xl font-bold text-zinc-100">{task.title}</h1>
                </div>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-44 bg-zinc-800 border-zinc-700 text-zinc-300 shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700/50">
                    {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Banner URGENTE */}
              {task.isUrgent && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-red-300">Tarefa Urgente</p>
                      <p className="text-xs text-red-400/70">Todas as demais tarefas do responsável estão bloqueadas até a conclusão desta</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => { setTaskUrgent(id, false); toast.success("Urgência removida — tarefas desbloqueadas"); }}
                      className="shrink-0 px-2.5 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium transition-colors"
                    >
                      Remover urgência
                    </button>
                  )}
                </div>
              )}

              {/* Banner bloqueado por urgência */}
              {task.urgentBlockedById && (() => {
                const urgentTask = tasks.find((t) => t.id === task.urgentBlockedById);
                const isStillBlocking = urgentTask && !["CONCLUIDA", "CANCELADA"].includes(urgentTask.status);
                return urgentTask && isStillBlocking ? (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 mb-4">
                    <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-300">Bloqueada por tarefa urgente</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-orange-400/70">Aguardando conclusão de:</span>
                        <Link href={`/tasks/${urgentTask.id}`} className="text-xs text-orange-300 hover:underline font-medium">
                          {urgentTask.title}
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {isBlocked && !task.urgentBlockedById && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                  <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-300 mb-1">Tarefa bloqueada por dependências</p>
                    <div className="space-y-1">
                      {pendingBlockers.map((b) => (
                        <div key={b.id} className="flex items-center gap-1.5 text-xs text-red-300/80">
                          <ArrowRight className="w-3 h-3 shrink-0" />
                          <Link href={`/tasks/${b.id}`} className="hover:underline truncate">{b.title}</Link>
                          <span className="text-red-400/60 shrink-0">({getStatusLabel(b.status)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* Fim banners de status */}

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">{task.description}</p>

              {subtasks.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-400">Subtarefas ({completedSubtasks}/{subtasks.length})</span>
                    <span className="text-xs text-zinc-500">{Math.round((completedSubtasks / subtasks.length) * 100)}%</span>
                  </div>
                  <Progress value={(completedSubtasks / subtasks.length) * 100} className="h-1.5 bg-zinc-800 mb-3" />
                  <div className="space-y-1.5">
                    {subtasks.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => toggleSubtask(sub.id)}
                        className="flex items-center gap-2.5 w-full p-2 rounded-lg hover:bg-zinc-800/40 transition-colors text-left"
                      >
                        {sub.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-500 shrink-0" />
                        )}
                        <span className={`text-sm ${sub.completed ? "line-through text-zinc-500" : "text-zinc-300"}`}>{sub.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <Input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                  placeholder="Adicionar subtarefa..."
                  className="h-8 text-xs bg-zinc-800/50 border-zinc-700 text-zinc-300"
                />
                <Button size="sm" onClick={handleAddSubtask} className="h-8 bg-zinc-700 hover:bg-zinc-600 text-xs">
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="comments">
              <TabsList className="bg-zinc-900 border border-zinc-800 flex-wrap h-auto gap-y-1">
                <TabsTrigger value="comments" className="data-[state=active]:bg-zinc-800 text-xs">
                  Comentários ({comments.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="data-[state=active]:bg-zinc-800 text-xs">
                  Anotações
                </TabsTrigger>
                <TabsTrigger value="attachments" className="data-[state=active]:bg-zinc-800 text-xs">
                  Anexos
                </TabsTrigger>
                <TabsTrigger value="timelogs" className="data-[state=active]:bg-zinc-800 text-xs">
                  Tempo ({timeLogs.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-zinc-800 text-xs">
                  Histórico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="comments" className="space-y-3 mt-3">
                <div className="flex gap-3">
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-[9px] bg-zinc-700">{user?.name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Adicionar comentário..."
                      className="bg-zinc-800/50 border-zinc-700 text-zinc-300 resize-none text-sm"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={handleAddComment} disabled={!commentText.trim()} className="bg-violet-600 hover:bg-violet-700 h-7 text-xs">
                        <Send className="w-3 h-3 mr-1" /> Comentar
                      </Button>
                    </div>
                  </div>
                </div>

                {comments.map((comment) => {
                  const author = users.find((u) => u.id === comment.userId);
                  return (
                    <div key={comment.id} className="flex gap-3 bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4">
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarImage src={author?.avatar} />
                        <AvatarFallback className="text-[9px] bg-zinc-700">{author?.name?.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-zinc-300">{author?.name}</span>
                          <span className="text-[10px] text-zinc-600">{formatRelativeTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="notes" className="mt-3">
                <NotesPanel taskId={id} />
              </TabsContent>

              <TabsContent value="attachments" className="mt-3">
                <AttachmentsPanel taskId={id} />
              </TabsContent>

              <TabsContent value="timelogs" className="mt-3">
                <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 mb-3">
                  <h4 className="text-xs font-semibold text-zinc-400 mb-3">Registrar Tempo</h4>
                  <div className="flex gap-2">
                    <Input
                      value={logHours} onChange={(e) => setLogHours(e.target.value)}
                      type="number" placeholder="Horas" className="w-20 h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-300"
                    />
                    <Input
                      value={logDesc} onChange={(e) => setLogDesc(e.target.value)}
                      placeholder="Descrição do trabalho realizado..."
                      className="flex-1 h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-300"
                    />
                    <Button size="sm" onClick={handleLogTime} className="h-8 bg-violet-600 hover:bg-violet-700 text-xs">
                      Registrar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {timeLogs.map((log) => {
                    const logUser = users.find((u) => u.id === log.userId);
                    return (
                      <div key={log.id} className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-800/40 rounded-lg">
                        <Timer className="w-4 h-4 text-zinc-500 shrink-0" />
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={logUser?.avatar} />
                          <AvatarFallback className="text-[8px] bg-zinc-700">{logUser?.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-xs text-zinc-300">{log.description}</p>
                          <p className="text-[10px] text-zinc-600">{log.date}</p>
                        </div>
                        <span className="text-sm font-semibold text-zinc-200">{log.hours}h</span>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-3">
                <div className="space-y-2">
                  {[...timeLogs].reverse().map((log, i) => {
                    const logUser = users.find((u) => u.id === log.userId);
                    return (
                      <div key={log.id} className="flex gap-3 p-3 bg-zinc-900/40 border border-zinc-800/40 rounded-lg">
                        <Activity className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-zinc-300">
                            <span className="font-medium text-zinc-200">{logUser?.name?.split(" ")[0]}</span>
                            {" "}registrou {log.hours}h — {log.description}
                          </p>
                          <p className="text-[10px] text-zinc-600 mt-0.5">{log.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            {/* Controle de Tempo — só aparece para o responsável ou admins */}
            <WorkTimer
              taskId={id}
              taskTitle={task.title}
              disabled={
                task.status === "CONCLUIDA" ||
                task.status === "CANCELADA" ||
                task.status === "BLOQUEADA"
              }
            />

            <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 space-y-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Detalhes</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User2 className="w-4 h-4 text-zinc-500 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <p className="text-[10px] text-zinc-600">Responsável</p>
                      {isAdmin && (
                        <ReassignPopover
                          currentUserId={task.assigneeId}
                          label="Reatribuir"
                          allowClear
                          onReassign={async (userId) => {
                            await updateTask(id, { assigneeId: userId ?? undefined });
                            toast.success(userId ? "Task reatribuída" : "Responsável removido");
                          }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={assignee?.avatar} />
                        <AvatarFallback className="text-[8px] bg-zinc-700">{assignee?.name?.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-zinc-300">{assignee?.name ?? "Sem responsável"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User2 className="w-4 h-4 text-zinc-500 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      <p className="text-[10px] text-zinc-600">Criado por</p>
                      {isAdmin && (
                        <ReassignPopover
                          currentUserId={task.reporterId}
                          label="Trocar"
                          onReassign={async (userId) => {
                            if (!userId) return;
                            await updateTask(id, { reporterId: userId });
                            toast.success("Criador atualizado");
                          }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-zinc-300">{reporter?.name}</span>
                  </div>
                </div>

                {project && (
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-zinc-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-600 mb-1">Projeto</p>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: project.color }} />
                        <span className="text-xs text-zinc-300">{project.name}</span>
                      </div>
                    </div>
                  </div>
                )}

                {task.dueDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-zinc-600 mb-1">Prazo</p>
                      <span className="text-xs text-zinc-300">{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Toggle urgência — sidebar */}
              {isAdmin && (
                <div className="pt-3 border-t border-zinc-800/50">
                  <button
                    onClick={() => {
                      const next = !task.isUrgent;
                      setTaskUrgent(id, next);
                      toast[next ? "warning" : "success"](
                        next ? "Tarefa marcada como URGENTE — outras tarefas bloqueadas" : "Urgência removida — tarefas desbloqueadas"
                      );
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      task.isUrgent
                        ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/15"
                        : "bg-zinc-800/30 border-zinc-700/40 hover:border-zinc-600/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className={`w-3.5 h-3.5 ${task.isUrgent ? "text-red-400" : "text-zinc-500"}`} />
                      <span className={`text-xs font-medium ${task.isUrgent ? "text-red-300" : "text-zinc-400"}`}>
                        {task.isUrgent ? "Urgente (ativo)" : "Marcar como Urgente"}
                      </span>
                    </div>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${task.isUrgent ? "bg-red-500" : "bg-zinc-700"}`}>
                      <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all ${task.isUrgent ? "left-4" : "left-0.5"}`} />
                    </div>
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-500">Horas</span>
                  <span className="text-xs font-semibold text-zinc-300">{task.actualHours}/{task.estimatedHours}h</span>
                </div>
                <Progress value={progressPercent} className="h-1.5 bg-zinc-800" />
                <p className="text-[10px] text-zinc-600 mt-1">
                  {progressPercent > 100 ? `${(progressPercent - 100).toFixed(0)}% acima do estimado` : `${(100 - progressPercent).toFixed(0)}% restante`}
                </p>
              </div>
            </div>

            {/* Dependências */}
            <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Dependências
                </h3>
                {(blockerTasks.length > 0 || blockedByMe.length > 0) && (
                  <span className="text-[10px] text-zinc-600">
                    {blockerTasks.length} bloqueadora{blockerTasks.length !== 1 ? "s" : ""} · {blockedByMe.length} dependente{blockedByMe.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Esta tarefa está bloqueada por */}
              {blockerTasks.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Precisa que terminem primeiro</p>
                  {blockerTasks.map((bt) => {
                    const dep = myDeps.find((d) => d.dependsOnTaskId === bt.id);
                    const done = bt.status === "CONCLUIDA" || bt.status === "CANCELADA";
                    return (
                      <div key={bt.id} className={`flex items-center gap-2 p-2 rounded-lg border text-xs group ${done ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
                        {done
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          : <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        }
                        <Link href={`/tasks/${bt.id}`} className={`flex-1 truncate hover:underline ${done ? "text-emerald-300/80 line-through" : "text-zinc-300"}`}>
                          {bt.title}
                        </Link>
                        <span className={`text-[10px] shrink-0 ${done ? "text-emerald-400/60" : "text-red-400/60"}`}>
                          {getStatusLabel(bt.status)}
                        </span>
                        {dep && (
                          <button
                            onClick={() => handleRemoveDep(dep)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-600 hover:text-red-400 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Esta tarefa bloqueia */}
              {blockedByMe.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Esta tarefa desbloqueia</p>
                  {blockedByMe.map((bt) => (
                    <div key={bt.id} className="flex items-center gap-2 p-2 rounded-lg border border-zinc-700/30 bg-zinc-800/30 text-xs">
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <Link href={`/tasks/${bt.id}`} className="flex-1 truncate text-zinc-400 hover:text-zinc-200 hover:underline">
                        {bt.title}
                      </Link>
                      <span className="text-[10px] text-zinc-600 shrink-0">{getStatusLabel(bt.status)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Adicionar dependência */}
              <div className="space-y-1.5">
                <input
                  value={depSearch}
                  onChange={(e) => setDepSearch(e.target.value)}
                  placeholder="Adicionar dependência... (buscar tarefa)"
                  className="w-full h-7 text-[11px] bg-zinc-800 border border-zinc-700/50 rounded-md px-2.5 text-zinc-300 placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors"
                />
                {depSearch.trim() && filteredAvailable.length > 0 && (
                  <div className="border border-zinc-700/50 rounded-lg divide-y divide-zinc-800/50 max-h-32 overflow-y-auto">
                    {filteredAvailable.slice(0, 6).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleAddDep(t.id)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800/60 transition-colors text-left"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${t.status === "CONCLUIDA" ? "bg-emerald-400" : t.status === "EM_DESENVOLVIMENTO" ? "bg-blue-400" : "bg-zinc-500"}`} />
                        <span className="flex-1 truncate">{t.title}</span>
                        <span className="text-zinc-600 text-[10px] shrink-0">{getStatusLabel(t.status)}</span>
                      </button>
                    ))}
                  </div>
                )}
                {depSearch.trim() && filteredAvailable.length === 0 && (
                  <p className="text-[11px] text-zinc-600 text-center py-1">Nenhuma tarefa encontrada</p>
                )}
              </div>

              {blockerTasks.length === 0 && blockedByMe.length === 0 && !depSearch && (
                <p className="text-[11px] text-zinc-700 text-center py-1">Nenhuma dependência definida</p>
              )}
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">Timeline</h3>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Criado em</span>
                  <span className="text-zinc-300">{formatDate(task.createdAt)}</span>
                </div>
                {task.startDate && (
                  <div className="flex justify-between">
                    <span>Iniciado em</span>
                    <span className="text-zinc-300">{formatDate(task.startDate)}</span>
                  </div>
                )}
                {task.completedAt && (
                  <div className="flex justify-between">
                    <span>Concluído em</span>
                    <span className="text-emerald-400">{formatDate(task.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
