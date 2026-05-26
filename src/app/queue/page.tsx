"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { ProjectAvatar } from "@/components/shared/project-avatar";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  ListOrdered,
  Crown,
  TrendingUp,
  ExternalLink,
  ArrowUpToLine,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Project } from "@/types";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

const statusLabels: Record<string, string> = {
  ATIVO: "Em andamento",
  PAUSADO: "Pausado",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  NA_FILA: "Na Fila",
};

const statusColors: Record<string, string> = {
  ATIVO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  PAUSADO: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  CONCLUIDO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CANCELADO: "bg-zinc-700/20 text-zinc-500 border-zinc-700/30",
  NA_FILA: "bg-violet-500/20 text-violet-400 border-violet-500/30",
};

function PositionBadge({ position }: { position: number }) {
  if (position === 1)
    return (
      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30">
        1
      </div>
    );
  if (position === 2)
    return (
      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-zinc-500/20 text-zinc-300 border border-zinc-500/30">
        2
      </div>
    );
  if (position === 3)
    return (
      <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-orange-900/30 text-orange-400 border border-orange-800/30">
        3
      </div>
    );
  return (
    <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-zinc-800/60 text-zinc-500 border border-zinc-700/30">
      {position}
    </div>
  );
}

function QueueCard({
  project,
  position,
  onPromote,
  isAdmin,
}: {
  project: Project;
  position: number;
  onPromote: () => void;
  isAdmin: boolean;
}) {
  const { users } = useUserStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    disabled: !isAdmin,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };

  const devs = users.filter((u) => project.developerIds.includes(u.id));
  const owner = users.find((u) => u.id === project.ownerId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex items-center gap-3 bg-zinc-900/60 border border-zinc-800/50 rounded-xl px-4 py-3 hover:border-zinc-700/50 transition-all hover:shadow-lg hover:shadow-black/20"
    >
      <Link
        href={`/projects/${project.id}`}
        aria-label={`Ver projeto ${project.name}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
      />

      {/* Drag handle */}
      {isAdmin && (
        <button
          {...attributes}
          {...listeners}
          className="relative z-10 cursor-grab active:cursor-grabbing text-zinc-700 hover:text-zinc-400 transition-colors shrink-0 touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}

      <PositionBadge position={position} />

      {/* Project avatar + info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <ProjectAvatar name={project.name} color={project.color} avatar={project.avatar} size="sm" />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-100 truncate">{project.name}</h3>
          <p className="text-xs text-zinc-500 truncate mt-0.5 max-w-xs">{project.description}</p>
        </div>
      </div>

      {/* Status */}
      <span
        className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border shrink-0 ${statusColors[project.status]}`}
      >
        {statusLabels[project.status]}
      </span>

      {/* End date */}
      {project.endDate && (
        <div className="hidden md:flex items-center gap-1 text-xs text-zinc-500 shrink-0">
          <Calendar className="w-3 h-3 text-zinc-600" />
          {formatDate(project.endDate)}
        </div>
      )}

      {/* Progress */}
      <div className="hidden lg:flex flex-col gap-1 w-20 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-500">Progresso</span>
          <span className="text-[10px] font-semibold text-zinc-300">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1 bg-zinc-800" />
      </div>

      {/* Devs */}
      <div className="hidden xl:flex -space-x-1.5 shrink-0">
        {devs.slice(0, 3).map((dev) => (
          <Avatar key={dev.id} className="w-6 h-6 border border-zinc-900">
            <AvatarImage src={dev.avatar} />
            <AvatarFallback className="text-[9px] bg-zinc-700">{dev.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        ))}
        {devs.length > 3 && (
          <div className="w-6 h-6 rounded-full bg-zinc-700 border border-zinc-900 flex items-center justify-center text-[9px] text-zinc-300">
            +{devs.length - 3}
          </div>
        )}
      </div>

      {/* Owner */}
      <div className="hidden 2xl:flex items-center gap-1 text-xs text-zinc-500 shrink-0">
        <Crown className="w-3 h-3 text-amber-400/70" />
        <span className="truncate max-w-[80px]">{owner?.name ?? "—"}</span>
      </div>

      {/* Actions */}
      <div className="relative z-10 flex items-center gap-1 shrink-0 ml-1">
        {isAdmin && position > 1 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onPromote}
            className="h-7 w-7 p-0 text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10"
            title="Mover para o topo"
          >
            <ArrowUpToLine className="w-3.5 h-3.5" />
          </Button>
        )}
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center justify-center h-7 w-7 rounded-md text-zinc-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
          title="Ver projeto"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function QueuePage() {
  const { getQueuedProjects, reorderQueue } = useProjectStore();
  const { isAdmin } = useAuth();
  const queuedProjects = getQueuedProjects();

  const [localIds, setLocalIds] = useState<string[] | null>(null);
  const orderedProjects = localIds
    ? (localIds.map((id) => queuedProjects.find((p) => p.id === id)).filter(Boolean) as Project[])
    : queuedProjects;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = orderedProjects.map((p) => p.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    const newOrder = arrayMove(ids, oldIndex, newIndex);
    setLocalIds(newOrder);
    reorderQueue(newOrder);
    toast.success("Ordem da fila atualizada");
  }

  function handlePromote(projectId: string) {
    const ids = orderedProjects.map((p) => p.id);
    const idx = ids.indexOf(projectId);
    if (idx <= 0) return;
    const newOrder = arrayMove(ids, idx, 0);
    setLocalIds(newOrder);
    reorderQueue(newOrder);
    toast.success("Projeto movido para o topo da fila");
  }

  const firstProject = orderedProjects[0];

  return (
    <AppLayout>
      <PageHeader
        title="Fila de Desenvolvimento"
        description={
          orderedProjects.length === 0
            ? "Nenhum projeto na fila"
            : `${orderedProjects.length} projeto${orderedProjects.length !== 1 ? "s" : ""} ordenado${orderedProjects.length !== 1 ? "s" : ""} por prioridade de entrega`
        }
      />

      <div className="p-6">
        {orderedProjects.length === 0 ? (
          <EmptyState
            icon={ListOrdered}
            title="Nenhum projeto ativo"
            description="Projetos ativos e pausados aparecerão aqui automaticamente ordenados pela data de entrega."
          />
        ) : (
          <div className="space-y-4">
            {/* Legenda */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                Ordenado por data de entrega (mais urgente primeiro)
              </div>
              {isAdmin && (
                <>
                  <span className="text-zinc-700">·</span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <GripVertical className="w-3 h-3" /> Arraste para reordenar manualmente
                  </span>
                </>
              )}
            </div>

            {/* Destaque do #1 */}
            {firstProject && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  href={`/projects/${firstProject.id}`}
                  className="group flex items-center gap-4 bg-gradient-to-r from-amber-500/5 via-zinc-900/60 to-transparent border border-amber-500/20 rounded-xl p-4 transition-colors hover:border-amber-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-amber-400">1</span>
                  </div>
                  <ProjectAvatar
                    name={firstProject.name}
                    color={firstProject.color}
                    avatar={firstProject.avatar}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-0.5">
                      Maior prioridade
                    </p>
                    <h2 className="text-base font-semibold text-zinc-100 truncate">{firstProject.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${statusColors[firstProject.status]}`}
                      >
                        {statusLabels[firstProject.status]}
                      </span>
                      {firstProject.endDate && (
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <Calendar className="w-3 h-3" /> Entrega: {formatDate(firstProject.endDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 group-hover:text-amber-300 shrink-0 transition-colors">
                    Ver projeto <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            )}

            {/* Lista ordenável */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedProjects.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {orderedProjects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <QueueCard
                        project={project}
                        position={i + 1}
                        isAdmin={isAdmin}
                        onPromote={() => handlePromote(project.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
