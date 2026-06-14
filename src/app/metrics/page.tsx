"use client";

import { StatCard } from "@/components/shared/stat-card";
import { useMetrics } from "@/hooks/use-metrics";
import { motion } from "@/lib/motion";
import {
  TrendingUp, Target, Clock, Zap, AlertTriangle, CheckCircle2,
  BarChart2, Activity, RefreshCw,
} from "lucide-react";
import {
  MetricsAreaChart,
  MetricsBarChart,
  MetricsPieChart,
  PerformanceRadarChart,
} from "@/components/shared/mui-charts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useProjectStore } from "@/stores";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceRadarHelp } from "@/components/shared/performance-radar-help";
import { BurndownHelp } from "@/components/shared/burndown-help";

export default function MetricsPage() {
  const { projects } = useProjectStore();
  const [projectFilter, setProjectFilter] = useState("all");
  const { summary, burndownData, velocityData, complexityDistribution, hoursData, tasksByStatus } = useMetrics(projectFilter === "all" ? undefined : projectFilter);

  const burndownScopeLabel =
    projectFilter === "all"
      ? "Todos os projetos"
      : (projects.find((p) => p.id === projectFilter)?.name ?? "Projeto selecionado");

  const radarData = [
    { metric: "Estimativa", value: summary.estimationAccuracy },
    { metric: "Velocidade", value: Math.min(100, (summary.throughput / 10) * 100) },
    { metric: "Qualidade", value: 100 - summary.reworkRate },
    { metric: "Entrega", value: Math.min(100, (summary.completedTasks / Math.max(summary.totalTasks, 1)) * 100) },
    { metric: "Eficiência", value: Math.min(100, summary.totalHoursEstimated > 0 ? (summary.totalHoursEstimated / Math.max(summary.totalHoursActual, 1)) * 100 : 50) },
  ];

  return (
      <div className="p-6 w-full space-y-6">
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
                <MetricsBarChart
                  data={hoursData}
                  xKey="day"
                  height={200}
                  series={[{ key: "horas", label: "Horas", color: "#6366f1" }]}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="text-sm font-semibold text-zinc-100">Radar de Performance</h3>
                  <PerformanceRadarHelp />
                </div>
                <p className="text-xs text-zinc-500 mb-4">Visão 360° da equipe</p>
                <PerformanceRadarChart
                  height={240}
                  items={radarData.map((item) => ({
                    label: item.metric,
                    value: item.value,
                  }))}
                />
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-sm font-semibold text-zinc-100">Burndown</h3>
                <BurndownHelp scopeLabel={burndownScopeLabel} />
              </div>
              <p className="text-xs text-zinc-500 mb-4">
                {burndownScopeLabel} · últimos 7 dias · todas as tarefas do escopo
              </p>
              <MetricsAreaChart
                data={burndownData}
                xKey="date"
                height={220}
                series={[
                  { key: "estimado", label: "Estimado", color: "#6366f1" },
                  { key: "real", label: "Real", color: "#22c55e" },
                ]}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="velocity">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-zinc-100 mb-1">Velocidade por Sprint</h3>
              <p className="text-xs text-zinc-500 mb-4">Story points entregues vs meta</p>
              <MetricsBarChart
                data={velocityData}
                xKey="sprint"
                height={280}
                series={[
                  { key: "pontos", label: "Pontos Entregues", color: "#6366f1" },
                  { key: "meta", label: "Meta", color: "#f59e0b" },
                ]}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="distribution">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-zinc-100 mb-4">Por Complexidade</h3>
                <MetricsPieChart
                  height={240}
                  items={complexityDistribution.map((entry) => ({
                    label: entry.complexity,
                    value: entry.count,
                    color: entry.fill,
                  }))}
                />
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
  );
}
