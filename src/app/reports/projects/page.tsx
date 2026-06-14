"use client";

import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { motion } from "@/lib/motion";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, Users, Box } from "lucide-react";
import { PrintButton } from "@/components/shared/print-button";
import { StatusBadge } from "@/components/shared/task-badge";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import Link from "@/lib/router";

export default function ProjectsReportPage() {
  const { tasks, timeLogs } = useTaskStore();
  const { projects, modules } = useProjectStore();
  const { users } = useUserStore();

  const today = new Date().toISOString().split("T")[0];

  const projectStats = projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    const projectModules = modules.filter((m) => m.projectId === project.id);
    const completed = projectTasks.filter((t) => t.status === "CONCLUIDA").length;
    const inProgress = projectTasks.filter((t) => t.status === "EM_DESENVOLVIMENTO").length;
    const blocked = projectTasks.filter((t) => t.status === "BLOQUEADA").length;
    const overdue = projectTasks.filter(
      (t) => t.dueDate && t.dueDate < today && !["CONCLUIDA", "CANCELADA"].includes(t.status)
    ).length;
    const totalHours = timeLogs
      .filter((tl) => projectTasks.some((t) => t.id === tl.taskId))
      .reduce((acc, tl) => acc + tl.hours, 0);
    const estimatedHours = projectTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
    const teamSize = project.developerIds.length + 1;
    const owner = users.find((u) => u.id === project.ownerId);

    // Distribuição por status
    const byStatus = projectTasks.reduce<Record<string, number>>((acc, t) => {
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    }, {});

    return {
      project,
      modules: projectModules,
      total: projectTasks.length,
      completed,
      inProgress,
      blocked,
      overdue,
      totalHours,
      estimatedHours,
      teamSize,
      owner,
      byStatus,
    };
  });

  const totalCompleted = projectStats.reduce((a, p) => a + p.completed, 0);
  const totalTasks = projectStats.reduce((a, p) => a + p.total, 0);
  const totalHoursAll = projectStats.reduce((a, p) => a + p.totalHours, 0);
  const projectsOnTrack = projectStats.filter((p) => p.overdue === 0 && p.project.status === "ATIVO").length;

  return (
      <div className="p-6 w-full space-y-6" data-print-content
        data-print-footer
        data-date={new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}>
        <div className="flex items-start justify-between gap-4" data-print-header>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-violet-400" />
              Progresso dos Projetos
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">Visão detalhada do andamento de cada projeto</p>
          </div>
          <PrintButton />
        </div>

        {/* Resumo geral */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Projetos Ativos", value: projects.filter((p) => p.status === "ATIVO").length, icon: ClipboardList, color: "text-violet-400", bg: "bg-violet-500/10" },
            { label: "Tarefas Concluídas", value: `${totalCompleted}/${totalTasks}`, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
            { label: "Horas Totais", value: `${totalHoursAll.toFixed(0)}h`, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
            { label: "Projetos em Dia", value: projectsOnTrack, icon: AlertTriangle, color: projectsOnTrack === projects.filter(p => p.status === "ATIVO").length ? "text-emerald-400" : "text-orange-400", bg: "bg-emerald-500/10" },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4">
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${s.bg}`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Cartões por projeto */}
        <div className="space-y-4">
          {projectStats.map((ps, i) => (
            <motion.div
              key={ps.project.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <ProjectAvatar name={ps.project.name} color={ps.project.color} avatar={ps.project.avatar} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link href={`/projects/${ps.project.id}`} className="text-base font-semibold text-zinc-100 hover:text-violet-400 transition-colors">
                      {ps.project.name}
                    </Link>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      ps.project.status === "ATIVO" ? "bg-emerald-500/20 text-emerald-400" :
                      ps.project.status === "PAUSADO" ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-zinc-700 text-zinc-400"
                    }`}>{ps.project.status}</span>
                    {ps.overdue > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold">
                        {ps.overdue} atrasada{ps.overdue > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{ps.project.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-zinc-100">{ps.project.progress}%</p>
                  <p className="text-[10px] text-zinc-600">progresso</p>
                </div>
              </div>

              {/* Barra de progresso */}
              <Progress value={ps.project.progress} className="h-2 bg-zinc-800 mb-4" />

              {/* Métricas */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: "Total", value: ps.total, color: "text-zinc-300" },
                  { label: "Concluídas", value: ps.completed, color: "text-emerald-400" },
                  { label: "Em Andamento", value: ps.inProgress, color: "text-violet-400" },
                  { label: "Bloqueadas", value: ps.blocked, color: ps.blocked > 0 ? "text-red-400" : "text-zinc-600" },
                  { label: "Horas", value: `${ps.totalHours.toFixed(0)}/${ps.estimatedHours}h`, color: "text-blue-400" },
                ].map((m) => (
                  <div key={m.label} className="bg-zinc-800/40 rounded-lg p-2.5 text-center">
                    <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-[9px] text-zinc-600 mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Rodapé: módulos + equipe */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50 text-xs text-zinc-600">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Box className="w-3 h-3" /> {ps.modules.length} módulo{ps.modules.length !== 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ps.teamSize} membro{ps.teamSize !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-3">
                  {ps.owner && (
                    <span>Responsável: <span className="text-zinc-400">{ps.owner.name.split(" ")[0]}</span></span>
                  )}
                  <Link
                    href={`/reports/projects/${ps.project.id}`}
                    className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                  >
                    Ver relatório →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
  );
}
