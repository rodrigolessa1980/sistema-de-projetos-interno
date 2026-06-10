"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle2, Clock, Zap, AlertTriangle, BarChart2 } from "lucide-react";
import { PrintButton } from "@/components/shared/print-button";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from "recharts";

export default function ProductivityReportPage() {
  const { tasks, timeLogs } = useTaskStore();
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const { isAdmin, user } = useAuth();

  const targetUsers = isAdmin ? users : users.filter((u) => u.id === user?.id);

  const devStats = targetUsers.map((u) => {
    const userTasks = tasks.filter((t) => t.assigneeId === u.id);
    const completed = userTasks.filter((t) => t.status === "CONCLUIDA");
    const inProgress = userTasks.filter((t) => t.status === "EM_DESENVOLVIMENTO");
    const overdue = userTasks.filter(
      (t) => t.dueDate && t.dueDate < new Date().toISOString().split("T")[0] && !["CONCLUIDA", "CANCELADA"].includes(t.status)
    );
    const totalHours = timeLogs.filter((tl) => tl.userId === u.id).reduce((acc, tl) => acc + tl.hours, 0);
    const estimatedTotal = userTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
    const actualTotal = userTasks.reduce((acc, t) => acc + t.actualHours, 0);
    const accuracy = estimatedTotal > 0 ? Math.round((1 - Math.abs(actualTotal - estimatedTotal) / estimatedTotal) * 100) : null;
    const completionRate = userTasks.length > 0 ? Math.round((completed.length / userTasks.length) * 100) : 0;
    const projectCount = new Set(userTasks.map((t) => t.projectId)).size;

    return {
      user: u,
      total: userTasks.length,
      completed: completed.length,
      inProgress: inProgress.length,
      overdue: overdue.length,
      totalHours,
      estimatedTotal,
      actualTotal,
      accuracy,
      completionRate,
      projectCount,
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  const chartData = devStats.map((d) => ({
    name: d.user.name.split(" ")[0],
    Concluídas: d.completed,
    "Em Andamento": d.inProgress,
    Atrasadas: d.overdue,
  }));

  return (
    <AppLayout>
      <div className="p-6 w-full space-y-6" data-print-content
        data-print-footer
        data-date={new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}>
        <div className="flex items-start justify-between gap-4" data-print-header>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-400" />
              Relatório de Produtividade
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Desempenho individual por desenvolvedor</p>
          </div>
          <PrintButton />
        </div>

        {/* Gráfico comparativo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
        >
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Distribuição de Tarefas por Desenvolvedor</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip
                contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#a1a1aa" }}
              />
              <Bar dataKey="Concluídas" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Em Andamento" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Atrasadas" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cards por desenvolvedor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devStats.map((dev, i) => (
            <motion.div
              key={dev.user.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
            >
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarImage src={dev.user.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold">
                    {dev.user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-100">{dev.user.name}</p>
                  <p className="text-xs text-zinc-500">{dev.user.role === "ADMIN" ? "Administrador" : "Desenvolvedor"} · {dev.projectCount} projeto{dev.projectCount !== 1 ? "s" : ""}</p>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                  dev.completionRate >= 70 ? "bg-emerald-500/20 text-emerald-400" :
                  dev.completionRate >= 40 ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                }`}>
                  {dev.completionRate}%
                </div>
              </div>

              {/* Taxa de conclusão */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>Taxa de conclusão</span>
                  <span>{dev.completed}/{dev.total} tarefas</span>
                </div>
                <Progress value={dev.completionRate} className="h-2 bg-zinc-800" />
              </div>

              {/* Stats em grade */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "Total", value: dev.total, icon: BarChart2, color: "text-zinc-400" },
                  { label: "Feitas", value: dev.completed, icon: CheckCircle2, color: "text-emerald-400" },
                  { label: "Ativas", value: dev.inProgress, icon: Zap, color: "text-violet-400" },
                  { label: "Atrasadas", value: dev.overdue, icon: AlertTriangle, color: dev.overdue > 0 ? "text-orange-400" : "text-zinc-600" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-zinc-800/40 rounded-lg p-2">
                    <stat.icon className={`w-3.5 h-3.5 mx-auto mb-1 ${stat.color}`} />
                    <p className="text-sm font-bold text-zinc-100">{stat.value}</p>
                    <p className="text-[9px] text-zinc-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Horas */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Horas registradas</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-zinc-400">{dev.totalHours}h total</span>
                  {dev.accuracy !== null && (
                    <span className={`font-semibold ${dev.accuracy >= 80 ? "text-emerald-400" : dev.accuracy >= 60 ? "text-amber-400" : "text-red-400"}`}>
                      {dev.accuracy}% precisão
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
