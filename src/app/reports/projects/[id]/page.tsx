"use client";

import { useEffect, useState } from "react";
import { useProjectStore, useUserStore } from "@/stores";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import Link from "@/lib/router";
import { useParams } from "@/lib/router";
import {
  ChevronLeft, BarChart3, Clock, Target, TrendingUp,
  Calendar, Users, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { ProjectAvatar } from "@/components/shared/project-avatar";

interface DevStats {
  userId: string; name: string; avatar: string | null;
  totalHours: number; logCount: number; taskCount: number; avgHoursPerDay: number;
}
interface CalendarDay {
  date: string; totalHours: number;
  developers: {
    userId: string; name: string; avatar: string | null; hours: number;
    logs: { taskId: string; taskTitle: string; hours: number; description: string }[];
  }[];
}
interface ProjectSummary {
  projectId: string; projectName: string;
  estimatedHours: number; actualHours: number; remainingHours: number;
  progressPercent: number; deviationPercent: number;
  workingDaysConsumed: number; workingDaysEstimated: number;
  startDate: string | null; developers: DevStats[];
}

export default function ProjectReportPage() {
  const { id } = useParams<{ id: string }>();
  const { getProjectById } = useProjectStore();
  const { users } = useUserStore();
  const project = getProjectById(id);

  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<ProjectSummary>(`reports/projects/${id}/summary`),
      api.get<{ projectId: string; days: CalendarDay[] }>(`reports/projects/${id}/calendar`),
    ])
      .then(([s, c]) => {
        setSummary(s);
        setCalendar(c.days ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return (
      <div className="p-6 w-full space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/reports/projects" className="hover:text-zinc-300 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Relatórios
          </Link>
          <span className="text-zinc-700">/</span>
          {project && (
            <>
              <Link href={`/projects/${id}`} className="hover:text-zinc-300">{project.name}</Link>
              <span className="text-zinc-700">/</span>
            </>
          )}
          <span className="text-zinc-300">Desempenho</span>
        </div>

        {/* Header */}
        {project && (
          <div className="flex items-center gap-4">
            <ProjectAvatar name={project.name} color={project.color} avatar={project.avatar} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">{project.name}</h1>
              <p className="text-sm text-zinc-500">Relatório de desempenho e horas</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-violet-500/40 border-t-violet-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && summary && (
          <>
            {/* KPIs principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Horas estimadas", value: `${summary.estimatedHours}h`, icon: Target, color: "text-zinc-400" },
                { label: "Horas realizadas", value: `${summary.actualHours.toFixed(1)}h`, icon: Clock, color: "text-violet-400" },
                { label: "Horas restantes", value: `${summary.remainingHours.toFixed(1)}h`, icon: TrendingUp, color: summary.remainingHours <= 0 ? "text-red-400" : "text-emerald-400" },
                {
                  label: "Desvio",
                  value: `${summary.deviationPercent}%`,
                  icon: BarChart3,
                  color: summary.deviationPercent > 110 ? "text-red-400" : summary.deviationPercent > 90 ? "text-yellow-400" : "text-emerald-400",
                },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                    <span className="text-xs text-zinc-500">{kpi.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Barra de progresso de horas */}
            {summary.estimatedHours > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="text-zinc-400">Consumo de horas</span>
                  <span className="text-zinc-300 font-medium">
                    {summary.actualHours.toFixed(1)}h / {summary.estimatedHours}h
                  </span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      summary.deviationPercent > 100 ? "bg-red-500" : "bg-violet-500"
                    }`}
                    style={{ width: `${Math.min(summary.deviationPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-zinc-600 mt-1.5">
                  <span>{summary.workingDaysConsumed} dias úteis consumidos</span>
                  <span>{summary.workingDaysEstimated} dias úteis estimados</span>
                </div>
              </div>
            )}

            {/* Desempenho por desenvolvedor */}
            {summary.developers.length > 0 && (
              <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-zinc-300 mb-5 flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-400" /> Desempenho por Desenvolvedor
                </h2>
                <div className="space-y-5">
                  {summary.developers.map((dev, i) => {
                    const pct = summary.actualHours > 0
                      ? Math.min(100, (dev.totalHours / summary.actualHours) * 100)
                      : 0;
                    const devUser = users.find((u) => u.id === dev.userId);
                    return (
                      <div key={dev.userId} className="flex items-start gap-4">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs text-zinc-600 w-4 text-right">{i + 1}</span>
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-bold text-white">
                              {dev.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-sm font-medium text-zinc-200">{dev.name}</span>
                              {devUser && (
                                <span className="text-xs text-zinc-600 ml-2">{devUser.position}</span>
                              )}
                            </div>
                            <span className="text-sm font-bold text-violet-400 shrink-0">{dev.totalHours.toFixed(1)}h</span>
                          </div>
                          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex gap-4 text-[11px] text-zinc-500">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {dev.taskCount} task{dev.taskCount !== 1 ? "s" : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {dev.avgHoursPerDay}h/dia médio
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" /> {dev.logCount} registro{dev.logCount !== 1 ? "s" : ""}
                            </span>
                            <span className="text-zinc-600 ml-auto">
                              {pct.toFixed(1)}% do total
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Calendário de trabalho */}
        {!loading && calendar.length > 0 && (
          <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-zinc-300 mb-5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400" /> Calendário de Trabalho
            </h2>
            <div className="space-y-3">
              {calendar.map((day) => (
                <div key={day.date} className="border border-zinc-800/60 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/40">
                    <span className="text-xs font-semibold text-zinc-200">
                      {new Date(day.date + "T12:00:00").toLocaleDateString("pt-BR", {
                        weekday: "long", day: "2-digit", month: "long",
                      })}
                    </span>
                    <Badge className="text-[10px] bg-violet-500/20 text-violet-400 border-violet-500/30">
                      {day.totalHours.toFixed(1)}h registradas
                    </Badge>
                  </div>
                  <div className="divide-y divide-zinc-800/40">
                    {day.developers.map((dev) => (
                      <div key={dev.userId} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-[9px] bg-zinc-700">
                              {dev.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-zinc-300">{dev.name}</span>
                          <span className="text-xs font-bold text-violet-400 ml-auto">{dev.hours.toFixed(1)}h</span>
                        </div>
                        <div className="pl-8 space-y-1.5">
                          {dev.logs.map((log, li) => (
                            <div key={li} className="flex gap-2 text-[11px]">
                              <span className="text-violet-400/80 shrink-0 font-medium">{log.hours.toFixed(1)}h</span>
                              <div className="min-w-0">
                                <span className="text-zinc-400 font-medium">{log.taskTitle}</span>
                                {log.description && (
                                  <span className="text-zinc-600"> — {log.description}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !summary && calendar.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BarChart3 className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-sm text-zinc-500 mb-1">Nenhuma hora registrada neste projeto</p>
            <p className="text-xs text-zinc-600">Os dados aparecerão conforme a equipe registrar tempo nas tarefas</p>
          </div>
        )}
      </div>
  );
}
