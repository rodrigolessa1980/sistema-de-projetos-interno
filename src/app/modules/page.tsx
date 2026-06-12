"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useProjectStore, useTaskStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "@/lib/motion";
import { Box, ChevronRight } from "lucide-react";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ModuleDetailDialog } from "@/features/modules/module-detail-dialog";
import type { ModuleStatus } from "@/types";

const moduleStatusLabels: Record<ModuleStatus, string> = {
  INICIADO: "Iniciado",
  EM_PROCESSO: "Em processo",
  CONCLUIDO: "Concluído",
};

const moduleStatusClasses: Record<ModuleStatus, string> = {
  INICIADO: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  EM_PROCESSO: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  CONCLUIDO: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export default function ModulesPage() {
  const { modules, projects, getEpicsByModule } = useProjectStore();
  const { tasks, timeLogs, getAttachmentsByModule } = useTaskStore();
  const { users } = useUserStore();
  const { isAdmin } = useAuth();
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const selectedModule = selectedModuleId ? modules.find((m) => m.id === selectedModuleId) ?? null : null;
  const selectedModuleTasks = selectedModule ? tasks.filter((t) => t.moduleId === selectedModule.id) : [];

  return (
    <>
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
                      const modAttachments = getAttachmentsByModule(mod.id);
                      const completedTasks = modTasks.filter((t) => t.status === "CONCLUIDA").length;
                      const status = mod.status ?? "INICIADO";

                      return (
                        <motion.div
                          role="button"
                          tabIndex={0}
                          key={mod.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setSelectedModuleId(mod.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedModuleId(mod.id);
                            }
                          }}
                          className={cn(
                            "group bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4",
                            "cursor-pointer transition-all hover:border-violet-500/30 hover:bg-zinc-900/80",
                            "hover:shadow-lg hover:shadow-violet-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60",
                            selectedModuleId === mod.id && "border-violet-500/40 bg-violet-500/5"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
                                {mod.name}
                              </h3>
                              <Badge className={`text-[9px] shrink-0 border ${moduleStatusClasses[status]}`}>
                                {moduleStatusLabels[status]}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-xs font-bold text-zinc-300">{mod.progress}%</span>
                              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{mod.description}</p>
                          <Progress value={mod.progress} className="h-1.5 bg-zinc-800 mb-3" />
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                              <span>{modEpics.length} epics</span>
                              <span>{modTasks.length} tarefas</span>
                              <span>{completedTasks} concluídas</span>
                              {modAttachments.length > 0 && (
                                <span>{modAttachments.length} anexo{modAttachments.length !== 1 ? "s" : ""}</span>
                              )}
                            </div>
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

      <ModuleDetailDialog
        module={selectedModule}
        tasks={selectedModuleTasks}
        timeLogs={timeLogs}
        attachments={selectedModule ? getAttachmentsByModule(selectedModule.id) : []}
        users={users}
        open={selectedModuleId !== null}
        onOpenChange={(open) => { if (!open) setSelectedModuleId(null); }}
        canUpload={isAdmin}
      />
    </>
  );
}
