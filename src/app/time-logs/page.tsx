"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLoading } from "@/components/shared/page-loading";
import { useTaskStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { formatDate, formatHours } from "@/lib/utils";
import { motion } from "@/lib/motion";
import { Clock, Timer, TrendingUp, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/task-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/shared/stat-card";
import Link from "@/lib/router";

export default function TimeLogsPage() {
  const { timeLogs, tasks } = useTaskStore();
  const hasLoaded = useTaskStore((s) => s.hasLoaded);
  const { users } = useUserStore();
  const { user, isAdmin } = useAuth();
  const [userFilter, setUserFilter] = useState("all");

  const visibleLogs = isAdmin
    ? (userFilter === "all" ? timeLogs : timeLogs.filter((tl) => tl.userId === userFilter))
    : timeLogs.filter((tl) => tl.userId === user?.id);

  const totalHours = visibleLogs.reduce((acc, tl) => acc + tl.hours, 0);
  const uniqueUsers = [...new Set(visibleLogs.map((tl) => tl.userId))].length;
  const avgPerDay = (totalHours / 7).toFixed(1);

  const groupedByDate = visibleLogs.reduce<Record<string, typeof visibleLogs>>((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <PageHeader title="Logs de Tempo" description="Registro de horas trabalhadas por tarefa" />

      <div className="p-4 sm:p-6 w-full space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total de Horas" value={`${totalHours}h`} icon={Clock} color="violet" delay={0.05} />
          <StatCard title="Registros" value={visibleLogs.length} icon={Timer} color="blue" delay={0.1} />
          <StatCard title="Média/Dia" value={`${avgPerDay}h`} icon={TrendingUp} color="emerald" delay={0.15} />
          <StatCard title="Colaboradores" value={uniqueUsers} icon={User2} color="amber" delay={0.2} />
        </div>

        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3">
            <Select value={userFilter} onValueChange={(value) => setUserFilter(value ?? "all")}>
              <SelectTrigger className="w-48 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700/50">
                <SelectItem value="all">Todos os usuários</SelectItem>
                {users.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {!hasLoaded ? (
          <PageLoading label="Carregando registros..." />
        ) : (
        <div className="space-y-4">
          {sortedDates.map((date, dateIdx) => {
            const dayLogs = groupedByDate[date];
            const dayTotal = dayLogs.reduce((acc, tl) => acc + tl.hours, 0);

            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dateIdx * 0.05 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/40">
                  <span className="text-sm font-semibold text-zinc-200">{formatDate(date)}</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-violet-400">
                    <Clock className="w-3.5 h-3.5" />
                    {dayTotal}h
                  </div>
                </div>

                <div className="divide-y divide-zinc-800/30">
                  {dayLogs.map((log) => {
                    const logUser = users.find((u) => u.id === log.userId);
                    const task = tasks.find((t) => t.id === log.taskId);

                    return (
                      <div key={log.id} className="flex items-center gap-4 px-4 py-3 hover:bg-zinc-800/20 transition-colors">
                        <Avatar className="w-7 h-7 shrink-0">
                          <AvatarImage src={logUser?.avatar} />
                          <AvatarFallback className="text-[9px] bg-zinc-700">{logUser?.name?.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <Link href={`/tasks/${log.taskId}`} className="text-sm text-zinc-200 hover:text-violet-400 truncate block">
                            {task?.title ?? log.taskId}
                          </Link>
                          <p className="text-xs text-zinc-500">{log.description}</p>
                        </div>
                        {task && <StatusBadge status={log.status} className="text-[9px] px-1.5 py-0 shrink-0 hidden md:flex" />}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-sm font-semibold text-zinc-200">{log.hours}h</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
        )}
      </div>
    </>
  );
}
