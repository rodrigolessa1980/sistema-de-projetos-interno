"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { useProjectStore, useTaskStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "@/lib/motion";
import { Box, Plus } from "lucide-react";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";

export default function ModulesPage() {
  const { modules, projects, getEpicsByModule } = useProjectStore();
  const { tasks } = useTaskStore();
  const { isAdmin } = useAuth();

  return (
    <AppLayout>
      <PageHeader title="Módulos" description={`${modules.length} módulos em todos os projetos`} />
      <div className="p-6 w-full">
        {modules.length === 0 ? (
          <EmptyState icon={Box} title="Nenhum módulo" description="Os módulos serão exibidos aqui." />
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const projectModules = modules.filter((m) => m.projectId === project.id);
              if (projectModules.length === 0) return null;
              return (
                <div key={project.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <ProjectAvatar name={project.name} color={project.color} avatar={project.avatar} size="xs" />
                    <h2 className="text-sm font-semibold text-zinc-300">{project.name}</h2>
                    <span className="text-xs text-zinc-600">({projectModules.length} módulos)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projectModules.map((mod, i) => {
                      const modEpics = getEpicsByModule(mod.id);
                      const modTasks = tasks.filter((t) => t.moduleId === mod.id);
                      return (
                        <motion.div
                          key={mod.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4 hover:border-zinc-700/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-sm font-semibold text-zinc-100">{mod.name}</h3>
                            <span className="text-xs font-bold text-zinc-300">{mod.progress}%</span>
                          </div>
                          <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{mod.description}</p>
                          <Progress value={mod.progress} className="h-1.5 bg-zinc-800 mb-3" />
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span>{modEpics.length} epics</span>
                            <span>{modTasks.length} tarefas</span>
                            <span>{modTasks.filter((t) => t.status === "CONCLUIDA").length} concluídas</span>
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
