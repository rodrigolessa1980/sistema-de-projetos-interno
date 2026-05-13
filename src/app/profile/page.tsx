"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useAuth } from "@/hooks/use-auth";
import { useTaskStore } from "@/stores";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, ComplexityBadge } from "@/components/shared/task-badge";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { Mail, Briefcase, Building, Clock, CheckCircle2, AlertTriangle, ListTodo } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const { tasks, timeLogs, auditLogs } = useTaskStore();

  if (!user) return null;

  const myTasks = tasks.filter((t) => t.assigneeId === user.id);
  const myTimeLogs = timeLogs.filter((tl) => tl.userId === user.id);
  const myAuditLogs = auditLogs.filter((al) => al.userId === user.id).slice(0, 20);
  const totalHours = myTimeLogs.reduce((acc, tl) => acc + tl.hours, 0);

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
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
                <Badge className={user.role === "ADMIN"
                  ? "bg-violet-500/20 text-violet-400 border-violet-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                }>
                  {user.role}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{user.position}</span>
                <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />{user.department}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/50">
            {[
              { label: "Tasks Totais", value: myTasks.length, icon: ListTodo, color: "text-zinc-200" },
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

        <Tabs defaultValue="tasks">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="tasks" className="data-[state=active]:bg-zinc-800">Minhas Tasks</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-zinc-800">Atividade Recente</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-2 mt-4">
            {myTasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`}
                className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-colors"
              >
                <StatusBadge status={task.status} className="text-[10px] shrink-0" />
                <span className="flex-1 text-sm text-zinc-200 truncate">{task.title}</span>
                <ComplexityBadge complexity={task.complexity} />
                <span className="text-xs text-zinc-500 hidden md:block">{formatDate(task.dueDate)}</span>
              </Link>
            ))}
          </TabsContent>

          <TabsContent value="activity" className="space-y-2 mt-4">
            {myAuditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl">
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
    </AppLayout>
  );
}
