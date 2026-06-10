"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/hooks/use-auth";
import { useTaskStore } from "@/stores";
import { useUserStore } from "@/stores/ui-store";
import { useProjectStore } from "@/stores";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  Mail, Briefcase, Building, Clock, CheckCircle2, AlertTriangle,
  ListTodo, Users, UserPlus, ShieldCheck, FolderKanban, Pencil,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { UserDialog } from "@/features/users/user-dialog";
import type { User } from "@/types";

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();
  const { tasks, timeLogs, auditLogs } = useTaskStore();
  const { users } = useUserStore();
  const { projects } = useProjectStore();

  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  if (!user) return null;

  const myTasks = tasks.filter((t) => t.assigneeId === user.id);
  const myTimeLogs = timeLogs.filter((tl) => tl.userId === user.id);
  const myAuditLogs = auditLogs.filter((al) => al.userId === user.id).slice(0, 20);
  const totalHours = myTimeLogs.reduce((acc, tl) => acc + tl.hours, 0);

  function handleCreateUser() {
    setEditUser(null);
    setUserDialogOpen(true);
  }

  function handleEditUser(u: User) {
    setEditUser(u);
    setUserDialogOpen(true);
  }

  return (
    <AppLayout>
      <div className="p-6 w-full">
        {/* Card do perfil */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-6 mb-6"
        >
          <div className="flex items-start gap-6">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-xl font-bold text-white">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-zinc-100">{user.name}</h1>
                <Badge
                  className={
                    user.role === "ADMIN"
                      ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  }
                >
                  {user.role === "ADMIN" ? (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    user.role
                  )}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  {user.position}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  {user.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/50">
            {[
              { label: "Tarefas Totais", value: myTasks.length, icon: ListTodo, color: "text-zinc-200" },
              { label: "Concluídas", value: myTasks.filter((t) => t.status === "CONCLUIDA").length, icon: CheckCircle2, color: "text-emerald-400" },
              { label: "Em Andamento", value: myTasks.filter((t) => t.status === "EM_DESENVOLVIMENTO").length, icon: Clock, color: "text-violet-400" },
              { label: "Horas Registradas", value: `${totalHours}h`, icon: Clock, color: "text-blue-400" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue={isAdmin ? "admin" : "tasks"}>
          <TabsList className="bg-zinc-900 border border-zinc-800">
            {isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-zinc-800 gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Administração
              </TabsTrigger>
            )}
            <TabsTrigger value="tasks" className="data-[state=active]:bg-zinc-800">Minhas Tarefas</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-zinc-800">Atividade Recente</TabsTrigger>
          </TabsList>

          {/* Aba Admin */}
          {isAdmin && (
            <TabsContent value="admin" className="mt-4 space-y-4">
              {/* Ações rápidas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleCreateUser}
                  className="flex items-center gap-4 p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/15 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-100">Criar Novo Usuário</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Adicionar e alocar em projetos/tasks</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                </button>

                <Link
                  href="/users"
                  className="flex items-center gap-4 p-4 bg-zinc-900/60 border border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-100">Gerenciar Usuários</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{users.length} usuário(s) cadastrado(s)</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </Link>
              </div>

              {/* Lista resumida de usuários */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Equipe
                </p>
                <div className="space-y-2">
                  {users.map((u) => {
                    const uTasks = tasks.filter((t) => t.assigneeId === u.id);
                    const uProjects = projects.filter(
                      (p) => p.developerIds.includes(u.id) || p.ownerId === u.id
                    );
                    const activeTasks = uTasks.filter((t) => t.status === "EM_DESENVOLVIMENTO");

                    return (
                      <div
                        key={u.id}
                        className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-all"
                      >
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-bold text-white">
                            {u.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">{u.name}</p>
                          <p className="text-[11px] text-zinc-500 truncate">{u.position}</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <FolderKanban className="w-3 h-3" />
                            {uProjects.length}
                          </span>
                  <span className="flex items-center gap-1">
                    <ListTodo className="w-3 h-3" />
                    {uTasks.length} tar.
                  </span>
                          {activeTasks.length > 0 && (
                            <Badge className="text-[9px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-1.5">
                              {activeTasks.length} ativo(s)
                            </Badge>
                          )}
                        </div>
                        <Badge
                          className={
                            u.role === "ADMIN"
                              ? "text-[9px] bg-violet-500/20 text-violet-400 border-violet-500/30 shrink-0"
                              : "text-[9px] bg-zinc-800 text-zinc-400 border-zinc-700 shrink-0"
                          }
                        >
                          {u.role}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditUser(u)}
                          className="w-7 h-7 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 shrink-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Minhas Tasks */}
          <TabsContent value="tasks" className="space-y-2 mt-4">
            {myTasks.length === 0 && (
              <p className="text-center text-zinc-500 text-sm py-8">Nenhuma tarefa atribuída</p>
            )}
            {myTasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-colors"
              >
                <StatusBadge status={task.status} className="text-[10px] shrink-0" />
                <span className="flex-1 text-sm text-zinc-200 truncate">{task.title}</span>
                <ComplexityBadge complexity={task.complexity} />
                <span className="text-xs text-zinc-500 hidden md:block">{formatDate(task.dueDate)}</span>
              </Link>
            ))}
          </TabsContent>

          {/* Atividade Recente */}
          <TabsContent value="activity" className="space-y-2 mt-4">
            {myAuditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl"
              >
                <div className="w-2 h-2 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                <div className="flex-1">
                  <p className="text-sm text-zinc-300">{log.description}</p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">{formatRelativeTime(log.createdAt)}</p>
                </div>
              </div>
            ))}
            {myAuditLogs.length === 0 && (
              <p className="text-center text-zinc-500 text-sm py-8">Nenhuma atividade registrada</p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog de criação/edição de usuário */}
      <UserDialog
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
        editUser={editUser}
      />
    </AppLayout>
  );
}
