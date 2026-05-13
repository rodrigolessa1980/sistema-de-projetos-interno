"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { useProjectStore, useTaskStore } from "@/stores";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/types";

const statusColors: Record<ProjectStatus, string> = {
  ATIVO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PAUSADO: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  CONCLUIDO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CANCELADO: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
};

export default function EpicsPage() {
  const { epics, projects, modules } = useProjectStore();
  const { tasks } = useTaskStore();

  return (
    <AppLayout>
      <PageHeader title="Epics" description={`${epics.length} epics em andamento`} />
      <div className="p-6">
        {epics.length === 0 ? (
          <EmptyState icon={Layers} title="Nenhum epic" description="Os epics serão exibidos aqui." />
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const projectEpics = epics.filter((e) => e.projectId === project.id);
              if (projectEpics.length === 0) return null;
              return (
                <div key={project.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: project.color }} />
                    <h2 className="text-sm font-semibold text-zinc-300">{project.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projectEpics.map((epic, i) => {
                      const module = modules.find((m) => m.id === epic.moduleId);
                      const epicTasks = tasks.filter((t) => t.epicId === epic.id);
                      return (
                        <motion.div
                          key={epic.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="text-sm font-semibold text-zinc-100">{epic.name}</h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0 ${statusColors[epic.status]}`}>
                              {epic.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{epic.description}</p>
                          {module && (
                            <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded mb-3 inline-block">{module.name}</span>
                          )}
                          <Progress value={epic.progress} className="h-1.5 bg-zinc-800 mb-2" />
                          <div className="flex items-center justify-between text-xs text-zinc-500">
                            <span>{epic.progress}% concluído</span>
                            <span>{epicTasks.length} tasks · {formatDate(epic.startDate)} – {formatDate(epic.endDate)}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
