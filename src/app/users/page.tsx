"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { useUserStore } from "@/stores/ui-store";
import { useTaskStore, useProjectStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Users, Mail, Briefcase, FolderKanban, CheckCircle2, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { redirect } from "next/navigation";

export default function UsersPage() {
  const { users } = useUserStore();
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { isAdmin } = useAuth();

  if (!isAdmin) return <EmptyState icon={Users} title="Acesso Restrito" description="Apenas administradores podem gerenciar usuários." />;

  return (
    <AppLayout>
      <PageHeader
        title="Gestão de Usuários"
        description={`${users.length} usuários cadastrados`}
      />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, i) => {
            const userTasks = tasks.filter((t) => t.assigneeId === user.id);
            const completedTasks = userTasks.filter((t) => t.status === "CONCLUIDA");
            const userProjects = projects.filter((p) => p.developerIds.includes(user.id) || p.ownerId === user.id);
            const totalHours = timeLogs.filter((tl) => tl.userId === user.id).reduce((acc, tl) => acc + tl.hours, 0);
            const completionRate = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-bold text-white">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.position}</p>
                    </div>
                  </div>
                  <Badge className={user.role === "ADMIN"
                    ? "bg-violet-500/20 text-violet-400 border-violet-500/30 text-[10px]"
                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]"
                  }>
                    {user.role}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-4">
                  <Briefcase className="w-3.5 h-3.5" />
                  {user.department}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-zinc-800/60 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-zinc-200">{userProjects.length}</p>
                    <p className="text-[10px] text-zinc-500">Projetos</p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-zinc-200">{userTasks.length}</p>
                    <p className="text-[10px] text-zinc-500">Tasks</p>
                  </div>
                  <div className="bg-zinc-800/60 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-zinc-200">{totalHours}h</p>
                    <p className="text-[10px] text-zinc-500">Horas</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-zinc-500">Taxa de conclusão</span>
                    <span className="text-xs font-semibold text-zinc-300">{completionRate}%</span>
                  </div>
                  <Progress value={completionRate} className="h-1.5 bg-zinc-800" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
