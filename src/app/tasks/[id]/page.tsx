"use client";

import { use, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { formatDate, formatDateTime, formatRelativeTime, getStatusLabel, ALL_STATUSES } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Clock, AlertTriangle, MessageSquare, CheckSquare,
  Square, Plus, Send, Calendar, User2, Layers, Timer, Activity,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { notFound } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { TaskStatus } from "@/types";
import { useUpdateTaskStatus, useLogTime } from "@/hooks/use-tasks";
import { WorkTimer } from "@/components/shared/work-timer";
import { NotesPanel } from "@/features/tasks/notes-panel";
import { AttachmentsPanel } from "@/features/tasks/attachments-panel";

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getTaskById, getSubtasksByTask, getCommentsByTask, getTimeLogsByTask, addComment, toggleSubtask, addSubtask, getDependenciesByTask } = useTaskStore();
  const { getProjectById } = useProjectStore();
  const { users } = useUserStore();
  const { user } = useAuth();
  const updateStatus = useUpdateTaskStatus();
  const logTimeMutation = useLogTime();

  const [commentText, setCommentText] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [logHours, setLogHours] = useState("");
  const [logDesc, setLogDesc] = useState("");

  const task = getTaskById(id);
  if (!task) notFound();

  const project = getProjectById(task.projectId);
  const assignee = users.find((u) => u.id === task.assigneeId);
  const reporter = users.find((u) => u.id === task.reporterId);
  const subtasks = getSubtasksByTask(id);
  const comments = getCommentsByTask(id);
  const timeLogs = getTimeLogsByTask(id);
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  const handleStatusChange = async (status: TaskStatus) => {
    await updateStatus.mutateAsync({ taskId: id, status, userId: user?.id ?? "" });
  };

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
      taskId: id, userId: user?.id ?? "", hours, description: logDesc,
      date: new Date().toISOString().split("T")[0], status: task.status,
    });
    setLogHours(""); setLogDesc("");
  };

  const progressPercent = task.estimatedHours > 0 ? Math.min(100, (task.actualHours / task.estimatedHours) * 100) : 0;

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/tasks" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-300">
            <ChevronLeft className="w-4 h-4" /> Tasks
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-sm text-zinc-400 truncate">{task.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <StatusBadge status={task.status} />
                    <ComplexityBadge complexity={task.complexity} />
                    {task.tags.map((tag) => (
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

              {task.status === "BLOQUEADA" && task.blockedReason && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{task.blockedReason}</p>
                </div>
              )}

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">{task.description}</p>

              {subtasks.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-400">Subtasks ({completedSubtasks}/{subtasks.length})</span>
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
                  placeholder="Adicionar subtask..."
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
                    <p className="text-[10px] text-zinc-600 mb-1">Responsável</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={assignee?.avatar} />
                        <AvatarFallback className="text-[8px] bg-zinc-700">{assignee?.name?.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-zinc-300">{assignee?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User2 className="w-4 h-4 text-zinc-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-zinc-600 mb-1">Reporter</p>
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
    </AppLayout>
  );
}
