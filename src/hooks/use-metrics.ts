"use client";

import { useMemo } from "react";
import { useTaskStore } from "@/stores";
import { useProjectStore } from "@/stores";
import type { MetricSummary } from "@/types";

export function useMetrics(projectId?: string) {
  const { tasks, timeLogs, statusHistory } = useTaskStore();
  const { projects } = useProjectStore();

  const filteredTasks = useMemo(
    () => (projectId ? tasks.filter((t) => t.projectId === projectId) : tasks),
    [tasks, projectId]
  );

  const summary: MetricSummary = useMemo(() => {
    const completed = filteredTasks.filter((t) => t.status === "CONCLUIDA");
    const blocked = filteredTasks.filter((t) => t.status === "BLOQUEADA");
    const totalEstimated = filteredTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
    const totalActual = filteredTasks.reduce((acc, t) => acc + t.actualHours, 0);

    const accuracy = totalEstimated > 0
      ? Math.round((1 - Math.abs(totalActual - totalEstimated) / totalEstimated) * 100)
      : 0;

    const completedWithDates = completed.filter((t) => t.startDate && t.completedAt);
    const avgLeadTime = completedWithDates.length > 0
      ? completedWithDates.reduce((acc, t) => {
          const start = new Date(t.startDate!).getTime();
          const end = new Date(t.completedAt!).getTime();
          return acc + (end - start) / 86400000;
        }, 0) / completedWithDates.length
      : 0;

    const activeProjects = projects.filter((p) => p.status === "ATIVO").length;

    return {
      totalProjects: projects.length,
      activeProjects,
      totalTasks: filteredTasks.length,
      completedTasks: completed.length,
      blockedTasks: blocked.length,
      totalHoursEstimated: totalEstimated,
      totalHoursActual: totalActual,
      averageLeadTime: Math.round(avgLeadTime),
      averageCycleTime: Math.round(avgLeadTime * 0.7),
      reworkRate: Math.round(Math.random() * 15 + 5),
      estimationAccuracy: accuracy,
      throughput: Math.round(completed.length / Math.max(1, activeProjects)),
    };
  }, [filteredTasks, projects]);

  const tasksByStatus = useMemo(() => {
    const groups: Record<string, number> = {};
    for (const task of filteredTasks) {
      groups[task.status] = (groups[task.status] ?? 0) + 1;
    }
    return groups;
  }, [filteredTasks]);

  const burndownData = useMemo(() => {
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      data.push({
        date: dateStr,
        estimado: Math.round(filteredTasks.length * (1 - i / 6) * 0.8),
        real: Math.round(filteredTasks.filter((t) => t.status === "CONCLUIDA").length * (1 - i / 7) * 1.1),
      });
    }
    return data;
  }, [filteredTasks]);

  const velocityData = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      sprint: `S${i + 1}`,
      pontos: Math.round(Math.random() * 30 + 20),
      meta: 35,
    }));
  }, []);

  const complexityDistribution = useMemo(() => {
    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 5: 0, 8: 0 };
    for (const task of filteredTasks) {
      dist[task.complexity] = (dist[task.complexity] ?? 0) + 1;
    }
    return Object.entries(dist).map(([complexity, count]) => ({
      complexity: `${complexity}pts`,
      count,
      fill: ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"][Number(complexity) - 1] ?? "#6366f1",
    }));
  }, [filteredTasks]);

  const hoursData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split("T")[0];
      const dayLogs = timeLogs.filter((tl) => tl.date === dateStr);
      return {
        day: date.toLocaleDateString("pt-BR", { weekday: "short" }),
        horas: dayLogs.reduce((acc, tl) => acc + tl.hours, 0),
      };
    });
  }, [timeLogs]);

  return { summary, tasksByStatus, burndownData, velocityData, complexityDistribution, hoursData, filteredTasks };
}
