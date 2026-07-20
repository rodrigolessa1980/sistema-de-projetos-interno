"use client";

import { PageHeader } from "@/components/shared/page-header";
import { useProjectStore, useTaskStore } from "@/stores";
import { useViewPrefs } from "@/stores/view-prefs-store";
import { motion } from "@/lib/motion";
import { Box, ChevronRight } from "lucide-react";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/shared/empty-state";
import { PageLoading } from "@/components/shared/page-loading";
import { Badge } from "@/components/ui/badge";
import { cn, moduleColorFromId, shortId, isDone, isModuleDone, calculateProgress } from "@/lib/utils";
import Link from "@/lib/router";
import { ModuleActions } from "@/features/modules/module-actions";
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
  const { modules, projects } = useProjectStore();
  const hasLoaded = useProjectStore((s) => s.hasLoaded);
  const { tasks, getAttachmentsByModule } = useTaskStore();
  // Por padrão esconde módulos concluídos; a escolha fica salva (persistida).
  const showDoneModules = useViewPrefs((s) => s.showDoneModules);
  const setShowDoneModules = useViewPrefs((s) => s.setShowDoneModules);

  return (
    <>
      <PageHeader
        title="Módulos"
        description="Um módulo é uma atividade de um setor do projeto — clique para ver a descrição completa e as tarefas."
      />
      <div className="p-6 w-full">
        {!hasLoaded ? (
          <PageLoading label="Carregando módulos..." />
        ) : modules.length === 0 ? (
          <EmptyState icon={Box} title="Nenhum módulo" description="Os módulos serão exibidos aqui." />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-end">
              <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
                <Switch size="sm" checked={showDoneModules} onCheckedChange={(v) => setShowDoneModules(v)} />
                Mostrar concluídos
              </label>
            </div>
            {projects.map((project) => {
              const projectModules = modules.filter((m) => m.projectId === project.id);
              if (projectModules.length === 0) return null;
              const doneModules = projectModules.filter((m) => isModuleDone(m.status)).length;
              const visibleModules = showDoneModules
                ? projectModules
                : projectModules.filter((m) => !isModuleDone(m.status));
              return (
                <div key={project.id} className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-4 sm:p-5">
                  {/* O PROJETO é o card (a seção). Cabeçalho + progresso + módulos
                      ficam DENTRO, deixando a hierarquia visual explícita. */}
                  <div className="flex items-center gap-3 mb-3">
                    <ProjectAvatar name={project.name} color={project.color} avatar={project.avatar} size="sm" />
                    <div className="min-w-0">
                      <h2 className="text-base font-bold text-zinc-100 truncate leading-tight">{project.name}</h2>
                      <span className="text-xs text-zinc-500">
                        {doneModules} de {projectModules.length} módulo{projectModules.length !== 1 ? "s" : ""} concluído{doneModules !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <span className="ml-auto text-sm font-bold text-zinc-200 shrink-0">
                      {calculateProgress(doneModules, projectModules.length)}%
                    </span>
                  </div>
                  <Progress value={calculateProgress(doneModules, projectModules.length)} className="h-1.5 bg-zinc-800 mb-4" />
                  {visibleModules.length === 0 ? (
                    <p className="text-xs text-zinc-600 italic py-2">
                      Todos os módulos deste projeto estão concluídos e ocultos.
                    </p>
                  ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {visibleModules.map((mod, i) => {
                      const modTasks = tasks.filter((t) => t.moduleId === mod.id);
                      const modAttachments = getAttachmentsByModule(mod.id);
                      const completedTasks = modTasks.filter((t) => isDone(t.status)).length;
                      const status = mod.status ?? "INICIADO";

                      return (
                        <motion.div
                          key={mod.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            "group relative bg-zinc-900/60 border border-zinc-800/50 rounded-xl p-4",
                            "cursor-pointer transition-all hover:border-violet-500/30 hover:bg-zinc-900/80",
                            "hover:shadow-blue-glow-lg"
                          )}
                        >
                          <Link
                            href={`/modules/${mod.id}`}
                            aria-label={`Abrir módulo ${mod.name}`}
                            className="absolute inset-0 z-[1] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
                          />
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: moduleColorFromId(mod.id) }} title={`Módulo ${shortId(mod.id)}`} />
                              <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">
                                {mod.name}
                              </h3>
                              <Badge className={`text-[9px] shrink-0 border ${moduleStatusClasses[status]}`}>
                                {moduleStatusLabels[status]}
                              </Badge>
                              <span className="text-[9px] font-mono text-zinc-600 shrink-0">{shortId(mod.id)}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <ModuleActions module={mod} className="relative z-[2] opacity-0 group-hover:opacity-100 transition-opacity" />
                              <span className="text-xs font-bold text-zinc-300">{mod.progress}%</span>
                              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                          <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{mod.description}</p>
                          <Progress value={mod.progress} className="h-1.5 bg-zinc-800 mb-3" />
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
