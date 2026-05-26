"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/shared/stat-card";
import { useMetrics } from "@/hooks/use-metrics";
import { motion } from "framer-motion";
import {
  TrendingUp, Target, Clock, Zap, AlertTriangle, CheckCircle2,
  BarChart2, Activity, RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, LineChart, Line,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useProjectStore } from "@/stores";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  const angle = midAngle ?? 0;
  const ratio = percent ?? 0;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-angle * RADIAN);
  const y = cy + radius * Math.sin(-angle * RADIAN);
  return ratio > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11}>
      {`${(ratio * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export default function MetricsPage() {
  const { projects } = useProjectStore();
  const [projectFilter, setProjectFilter] = useState("all");
  const { summary, burndownData, velocityData, complexityDistribution, hoursData, tasksByStatus } = useMetrics(projectFilter === "all" ? undefined : projectFilter);

  const radarData = [
    { metric: "Estimativa", value: summary.estimationAccuracy },
    { metric: "Velocidade", value: Math.min(100, (summary.throughput / 10) * 100) },
    { metric: "Qualidade", value: 100 - summary.reworkRate },
    { metric: "Entrega", value: Math.min(100, (summary.completedTasks / Math.max(summary.totalTasks, 1)) * 100) },
    { metric: "Eficiência", value: Math.min(100, summary.totalHoursEstimated > 0 ? (summary.totalHoursEstimated / Math.max(summary.totalHoursActual, 1)) * 100 : 50) },
  ];

  const tooltipStyle = { background: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", fontSize: "12px" };
  const labelStyle = { color: "#a1a1aa" };
  const tickStyle = { fill: "#71717a", fontSize: 11 };
  const axisProps = { axisLine: false, tickLine: false };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Dashboard de Métricas</h1>
            <p className="text-sm text-zinc-500">Análise de produtividade e desempenho</p>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Precisão de Estimativa" value={`${summary.estimationAccuracy}%`} icon={Target} color="emerald" delay={0.05} trend={5} />
          <StatCard title="Lead Time Médio" value={`${summary.averageLeadTime}d`} icon={Clock} color="blue" delay={0.1} />
          <StatCard title="Taxa de Retrabalho" value={`${summary.reworkRate}%`} icon={RefreshCw} color="red" delay={0.15} trend={-2} />
          <StatCard title="Throughput Semanal" value={`${summary.throughput}`} icon={Zap} color="violet" delay={0.2} trend={8} />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800 text-xs">Visão Geral</TabsTrigger>
            <TabsTrigger value="velocity" className="data-[state=active]:bg-zinc-800 text-xs">Velocidade</TabsTrigger>
            <TabsTrigger value="distribution" className="data-[state=active]:bg-zinc-800 text-xs">Distribuição</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">Horas por Dia</h3>
                <p className="text-xs text-zinc-500 mb-4">Últimos 7 dias</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={hoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="day" tick={tickStyle} {...axisProps} />
                    <YAxis tick={tickStyle} {...axisProps} />
                    <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                    <Bar dataKey="horas" name="Horas" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">Radar de Performance</h3>
                <p className="text-xs text-zinc-500 mb-4">Visão 360° da equipe</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#71717a", fontSize: 11 }} />
                    <Radar name="Performance" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">Burndown do Projeto</h3>
              <p className="text-xs text-zinc-500 mb-4">Progresso estimado vs real</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={burndownData}>
                  <defs>
                    <linearGradient id="gradEst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" tick={tickStyle} {...axisProps} />
                  <YAxis tick={tickStyle} {...axisProps} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "#71717a" }} />
                  <Area type="monotone" dataKey="estimado" name="Estimado" stroke="#6366f1" strokeWidth={2} fill="url(#gradEst)" />
                  <Area type="monotone" dataKey="real" name="Real" stroke="#22c55e" strokeWidth={2} fill="url(#gradReal)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="velocity">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">Velocidade por Sprint</h3>
              <p className="text-xs text-zinc-500 mb-4">Story points entregues vs meta</p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="sprint" tick={tickStyle} {...axisProps} />
                  <YAxis tick={tickStyle} {...axisProps} />
                  <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "#71717a" }} />
                  <Bar dataKey="pontos" name="Pontos Entregues" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="meta" name="Meta" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>

          <TabsContent value="distribution">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-100 mb-4">Por Complexidade</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={complexityDistribution}
                      cx="50%" cy="50%"
                      outerRadius={90}
                      labelLine={false}
                      label={renderCustomLabel}
                      dataKey="count"
                    >
                      {complexityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#71717a" }} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-100 mb-4">KPIs Principais</h3>
                <div className="space-y-4">
                  {[
                    { label: "Horas Estimadas", value: summary.totalHoursEstimated, max: summary.totalHoursEstimated, color: "bg-violet-500" },
                    { label: "Horas Realizadas", value: summary.totalHoursActual, max: summary.totalHoursEstimated, color: "bg-emerald-500" },
                    { label: "Tarefas Completas", value: summary.completedTasks, max: summary.totalTasks, color: "bg-blue-500" },
                    { label: "Tarefas Bloqueadas", value: summary.blockedTasks, max: summary.totalTasks, color: "bg-red-500" },
                  ].map((kpi) => (
                    <div key={kpi.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-zinc-400">{kpi.label}</span>
                        <span className="text-zinc-300 font-semibold">{kpi.value}</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, kpi.max > 0 ? (kpi.value / kpi.max) * 100 : 0)}%` }}
                          transition={{ duration: 0.8 }}
                          className={`h-full rounded-full ${kpi.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
