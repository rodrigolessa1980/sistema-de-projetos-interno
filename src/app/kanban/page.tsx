"use client";

import { useState, useMemo, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateKanbanOrder } from "@/hooks/use-tasks";
import { ComplexityBadge } from "@/components/shared/task-badge";
import { formatDate, getStatusLabel, getStatusDotColor } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, GripVertical, Plus, Lock, Flame } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { TaskStatus, Task } from "@/types";
import {
  DndContext, closestCorners, PointerSensor, useDroppable, useSensor, useSensors,
  type DragEndEvent, DragOverlay, type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { TaskCreateDialog } from "@/features/tasks/task-create-dialog";
import { useWorkSessionStore } from "@/stores/work-session-store";
import { formatElapsed } from "@/hooks/use-work-session";

const KANBAN_STATUSES: TaskStatus[] = [
  "BACKLOG", "PLANEJADA", "BLOQUEADA", "EM_DESENVOLVIMENTO",
  "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA", "CANCELADA",
];

/** Cronômetro inline leve — só renderiza quando a tarefa está ativa */
function ActiveElapsed() {
  const { getElapsedSeconds } = useWorkSessionStore();
  const [elapsed, setElapsed] = useState(getElapsedSeconds);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(getElapsedSeconds()), 1000);
    return () => clearInterval(interval);
  }, [getElapsedSeconds]);

  return (
    <span className="ml-auto font-mono text-[10px] font-bold text-violet-300 tabular-nums">
      {formatElapsed(elapsed)}
    </span>
  );
}

function KanbanCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const { users } = useUserStore();
  const { activeSession } = useWorkSessionStore();
  const { getBlockersForTask } = useTaskStore();
  const assignee = users.find((u) => u.id === task.assigneeId);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "CONCLUIDA";
  const isBeingWorked = activeSession?.taskId === task.id;
  const pendingBlockers = getBlockersForTask(task.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-task-id={task.id}
      className={cn(
        "border rounded-xl p-3 group cursor-grab active:cursor-grabbing transition-all",
        task.isUrgent
          ? "bg-red-500/5 border-red-500/40 shadow-lg shadow-red-500/10"
          : isBeingWorked
          ? "bg-violet-500/5 border-violet-500/40 shadow-lg shadow-violet-500/10"
          : "bg-zinc-900 border-zinc-800/60",
        isDragging && "shadow-2xl shadow-black/50 rotate-1"
      )}
      {...attributes}
      {...listeners}
    >
      {/* Barra de sessão ativa */}
      {isBeingWorked && (
        <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-md bg-violet-500/15 border border-violet-500/20">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
          <span className="text-[10px] font-semibold text-violet-300">Em andamento</span>
          <ActiveElapsed />
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {task.isUrgent && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[9px] font-bold text-red-400 animate-pulse">
              <Flame className="w-2.5 h-2.5" /> URGENTE
            </span>
          )}
          {task.urgentBlockedById && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/25 text-[9px] font-semibold text-orange-400">
              <Lock className="w-2.5 h-2.5" /> urgência
            </span>
          )}
          {!task.isUrgent && !task.urgentBlockedById && pendingBlockers.length > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/25 text-[9px] font-semibold text-red-400">
              <Lock className="w-2.5 h-2.5" /> {pendingBlockers.length} bloqueio{pendingBlockers.length > 1 ? "s" : ""}
            </span>
          )}
          {!task.isUrgent && !task.urgentBlockedById && pendingBlockers.length === 0 && task.status === "BLOQUEADA" && (
            <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
          )}
          <ComplexityBadge complexity={task.complexity} />
        </div>
        <GripVertical className="w-3.5 h-3.5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <Link href={`/tasks/${task.id}`} onClick={(e) => e.stopPropagation()}>
        <p className={cn(
          "text-xs font-medium transition-colors mb-2 line-clamp-2 leading-relaxed",
          isBeingWorked ? "text-violet-200 hover:text-violet-100" : "text-zinc-200 hover:text-violet-400"
        )}>
          {task.title}
        </p>
      </Link>

      {task.tags.slice(0, 2).map((tag) => (
        <span key={tag} className="inline-block text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded mr-1 mb-1">{tag}</span>
      ))}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/50">
        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
          <Clock className="w-3 h-3" />
          {task.actualHours}/{task.estimatedHours}h
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className={cn("text-[10px]", isOverdue ? "text-red-400" : "text-zinc-600")}>
              {formatDate(task.dueDate)}
            </span>
          )}
          <Avatar className="w-5 h-5">
            <AvatarImage src={assignee?.avatar} />
            <AvatarFallback className="text-[8px] bg-zinc-700">{assignee?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const dotColor = getStatusDotColor(status);
  const { isOver, setNodeRef } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  return (
    <div
      ref={setNodeRef}
      data-kanban-status={status}
      className={cn(
        "flex flex-col h-full min-w-0 bg-zinc-900/30 rounded-xl border overflow-hidden transition-colors",
        isOver ? "border-violet-500/60 bg-violet-500/5" : "border-zinc-800/40"
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-zinc-800/40">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", dotColor)} />
          <span className="text-xs font-semibold text-zinc-300">{getStatusLabel(status)}</span>
          <span className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-semibold">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext id={status} items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                <KanbanCard task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-16 border-2 border-dashed border-zinc-800/50 rounded-xl">
              <p className="text-[11px] text-zinc-600">Arraste aqui</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

const BLOCKED_TRANSITIONS: TaskStatus[] = ["EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA"];

function insertAt<T>(items: T[], item: T, index: number) {
  const next = [...items];
  next.splice(Math.max(0, Math.min(index, next.length)), 0, item);
  return next;
}

function areSameOrder(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

function getDropIndex(event: DragEndEvent, orderedIds: string[]) {
  const { active, over } = event;
  if (!over) return orderedIds.length;

  const overId = String(over.id);
  if (KANBAN_STATUSES.includes(overId as TaskStatus)) return orderedIds.length;

  const overIndex = orderedIds.indexOf(overId);
  if (overIndex === -1) return orderedIds.length;

  const activeRect = active.rect.current.translated ?? active.rect.current.initial;
  if (!activeRect) return overIndex;

  const overMiddle = over.rect.top + over.rect.height / 2;
  const shouldInsertAfter = activeRect.top > overMiddle;

  return overIndex + (shouldInsertAfter ? 1 : 0);
}

export default function KanbanPage() {
  const { tasks, getBlockersForTask } = useTaskStore();
  const { projects } = useProjectStore();
  const { isAdmin } = useAuth();
  const updateKanbanOrder = useUpdateKanbanOrder();
  const [projectFilter, setProjectFilter] = useState("all");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const visibleTasks = useMemo(() => {
    const base = tasks;
    if (projectFilter !== "all") return base.filter((t) => t.projectId === projectFilter);
    return base;
  }, [tasks, projectFilter]);

  const tasksByStatus = useMemo(() => {
    const groups: Record<TaskStatus, Task[]> = {} as Record<TaskStatus, Task[]>;
    for (const status of KANBAN_STATUSES) {
      groups[status] = visibleTasks
        .filter((t) => t.status === status)
        .sort((a, b) => a.order - b.order || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return groups;
  }, [visibleTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const overId = String(over.id);
    const overTask = tasks.find((t) => t.id === overId);
    const overColumn = KANBAN_STATUSES.includes(overId as TaskStatus) ? overId as TaskStatus : null;
    const targetStatus = overColumn ?? overTask?.status ?? activeTask.status;

    if (activeTask.status !== targetStatus) {
      if (BLOCKED_TRANSITIONS.includes(targetStatus)) {
        const blockers = getBlockersForTask(activeTask.id);
        if (blockers.length > 0) {
          const names = blockers.map((b) => `"${b.title}"`).join(", ");
          toast.error(`Não é possível mover: bloqueada por ${names}`);
          return;
        }
      }
    }

    const currentSourceIds = (tasksByStatus[activeTask.status] ?? []).map((task) => task.id);
    const sourceTaskIds = currentSourceIds.filter((id) => id !== activeId);
    const currentTargetIds = (tasksByStatus[targetStatus] ?? []).map((task) => task.id);
    const targetIdsWithoutActive = currentTargetIds.filter((id) => id !== activeId);
    const dropIndex = overId === activeId ? currentSourceIds.indexOf(activeId) : getDropIndex(event, targetIdsWithoutActive);
    const targetTaskIds = insertAt(targetIdsWithoutActive, activeId, dropIndex);

    if (activeTask.status === targetStatus && areSameOrder(currentSourceIds, targetTaskIds)) {
      return;
    }

    const result = await updateKanbanOrder.mutateAsync({
      taskId: activeId,
      targetStatus,
      targetTaskIds,
      sourceStatus: activeTask.status !== targetStatus ? activeTask.status : undefined,
      sourceTaskIds: activeTask.status !== targetStatus ? sourceTaskIds : undefined,
    });

    toast.success("Posição da tarefa atualizada");
    if (!result.persisted) {
      toast.warning(result.message ?? "Movimento salvo localmente; backend indisponível");
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
          <div>
            <h1 className="text-lg font-bold text-zinc-100">Quadro Kanban</h1>
            <p className="text-xs text-zinc-500">{visibleTasks.length} {visibleTasks.length === 1 ? "tarefa" : "tarefas"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={projectFilter} onValueChange={(value) => setProjectFilter(value ?? "all")}>
              <SelectTrigger className="w-44 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-8 text-xs">
                <SelectValue placeholder="Todos os projetos" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700/50">
                <SelectItem value="all">Todos os projetos</SelectItem>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {isAdmin && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-lg text-xs font-medium text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Tarefa
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-3 h-full min-h-[calc(100vh-200px)]" style={{ minWidth: `${KANBAN_STATUSES.length * 240}px` }}>
              {KANBAN_STATUSES.map((status) => (
                <div key={status} className="flex-1 min-w-[220px] max-w-[280px]">
                  <KanbanColumn status={status} tasks={tasksByStatus[status] ?? []} />
                </div>
              ))}
            </div>

            <DragOverlay>
              {activeTask && <KanbanCard task={activeTask} isDragging />}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {isAdmin && <TaskCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />}
    </AppLayout>
  );
}
