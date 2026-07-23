"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useTaskStore, useProjectStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateKanbanOrder } from "@/hooks/use-tasks";
import { ComplexityBadge } from "@/components/shared/task-badge";
import { formatDate, getStatusLabel, getStatusDotColor, getScheduleStatus, getHoursStatus } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, GripVertical, Plus, Lock, Flame, Users } from "lucide-react";
import { toast } from "sonner";
import Link from "@/lib/router";
import type { TaskStatus, Task } from "@/types";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { TaskCreateDialog } from "@/features/tasks/task-create-dialog";
import { TaskActions } from "@/features/tasks/task-actions";
import { PageLoading } from "@/components/shared/page-loading";
import { useWorkSessionStore } from "@/stores/work-session-store";
import { formatElapsed } from "@/hooks/use-work-session";

const KANBAN_STATUSES: TaskStatus[] = [
  "BACKLOG", "PLANEJADA", "BLOQUEADA", "EM_DESENVOLVIMENTO",
  "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA", "CANCELADA",
];

type ItemsByStatus = Record<TaskStatus, string[]>;

function buildItemsByStatus(tasks: Task[]): ItemsByStatus {
  const groups = {} as ItemsByStatus;
  for (const status of KANBAN_STATUSES) {
    groups[status] = tasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((t) => t.id);
  }
  return groups;
}

function findContainer(items: ItemsByStatus, id: string): TaskStatus | null {
  if (KANBAN_STATUSES.includes(id as TaskStatus)) return id as TaskStatus;
  for (const status of KANBAN_STATUSES) {
    if (items[status].includes(id)) return status;
  }
  return null;
}

function areItemsEqual(a: ItemsByStatus, b: ItemsByStatus) {
  return KANBAN_STATUSES.every((status) => areSameOrder(a[status], b[status]));
}

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
  const schedule = getScheduleStatus(task);
  const hours = getHoursStatus(task);
  const isBeingWorked = activeSession?.taskId === task.id;
  const pendingBlockers = getBlockersForTask(task.id);
  const tags = task.tags ?? [];

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: task.id,
    animateLayoutChanges: () => false,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isSortableDragging ? undefined : transition,
    opacity: isSortableDragging ? 0.35 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-task-id={task.id}
      className={cn(
        "border rounded-xl p-3 group cursor-grab active:cursor-grabbing touch-none",
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
        <div className="flex items-center gap-0.5 shrink-0">
          <TaskActions task={task} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          <GripVertical className="w-3.5 h-3.5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <Link href={`/tasks/${task.id}`} onClick={(e) => e.stopPropagation()}>
        <p className={cn(
          "text-xs font-medium transition-colors mb-2 line-clamp-2 leading-relaxed",
          isBeingWorked ? "text-violet-200 hover:text-violet-100" : "text-zinc-200 hover:text-violet-400"
        )}>
          {task.title}
        </p>
      </Link>

      {tags.slice(0, 2).map((tag) => (
        <span key={tag} className="inline-block text-[9px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded mr-1 mb-1">{tag}</span>
      ))}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/50">
        <div className={cn("flex items-center gap-1 text-[10px]", hours.over ? "text-red-400" : "text-zinc-500")}>
          <Clock className="w-3 h-3" />
          {task.actualHours}/{task.estimatedHours}h
          {hours.over && <span className="font-semibold">+{hours.deviationPct}%</span>}
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className={cn("text-[10px]", schedule.isLate ? "text-red-400" : "text-zinc-600")}>
              {schedule.status === "entregue-com-atraso" ? `${formatDate(task.dueDate)} · +${schedule.daysLate}d` : formatDate(task.dueDate)}
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

function KanbanColumn({
  status,
  taskIds,
  tasksById,
}: {
  status: TaskStatus;
  taskIds: string[];
  tasksById: Map<string, Task>;
}) {
  const dotColor = getStatusDotColor(status);
  const { isOver, setNodeRef } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  const columnTasks = taskIds
    .map((id) => tasksById.get(id))
    .filter((task): task is Task => Boolean(task));

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
            {columnTasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <SortableContext id={status} items={taskIds} strategy={verticalListSortingStrategy}>
          {columnTasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
          {columnTasks.length === 0 && (
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

function areSameOrder(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

function getInsertIndex(event: DragOverEvent | DragEndEvent, overId: string, orderedIds: string[]) {
  if (KANBAN_STATUSES.includes(overId as TaskStatus)) return orderedIds.length;

  const overIndex = orderedIds.indexOf(overId);
  if (overIndex === -1) return orderedIds.length;

  const activeRect = event.active.rect.current.translated ?? event.active.rect.current.initial;
  if (!activeRect || !event.over) return overIndex;

  const overMiddle = event.over.rect.top + event.over.rect.height / 2;
  return overIndex + (activeRect.top > overMiddle ? 1 : 0);
}

export default function KanbanPage() {
  const { tasks, getBlockersForTask } = useTaskStore();
  const hasLoaded = useTaskStore((s) => s.hasLoaded);
  const { projects } = useProjectStore();
  const { users } = useUserStore();
  const { user, can } = useAuth();
  const canCreateTask = can("tasks:create");
  const updateKanbanOrder = useUpdateKanbanOrder();
  const [projectFilter, setProjectFilter] = useState("all");
  // Filtro de responsável: "all" (todos), "me" (minhas) ou um userId específico.
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [localItems, setLocalItems] = useState<ItemsByStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Opções do filtro de responsável (também alimenta os rótulos do trigger).
  const assigneeItems = useMemo(
    () => [
      { value: "all", label: "Todos" },
      { value: "me", label: "Minhas tarefas" },
      ...users.map((u) => ({ value: u.id, label: u.name })),
    ],
    [users]
  );

  const visibleTasks = useMemo(() => {
    // Toda tarefa aparece no Kanban (inclui lançamentos de hora do timesheet).
    let base = projectFilter !== "all" ? tasks.filter((t) => t.projectId === projectFilter) : tasks;
    if (assigneeFilter === "me") {
      base = base.filter((t) => t.assigneeId === user?.id);
    } else if (assigneeFilter !== "all") {
      base = base.filter((t) => t.assigneeId === assigneeFilter);
    }
    return base;
  }, [tasks, projectFilter, assigneeFilter, user?.id]);

  const tasksById = useMemo(
    () => new Map(visibleTasks.map((task) => [task.id, task])),
    [visibleTasks]
  );

  const storeItems = useMemo(() => buildItemsByStatus(visibleTasks), [visibleTasks]);
  const itemsByStatus = localItems ?? storeItems;

  useEffect(() => {
    setLocalItems(null);
  }, [projectFilter, assigneeFilter]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasksById.get(String(event.active.id));
    if (task) {
      setActiveTask(task);
      setLocalItems((current) => current ?? storeItems);
    }
  };

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    setLocalItems((prev) => {
      const items = prev ?? storeItems;
      const activeContainer = findContainer(items, activeId);
      const overContainer = findContainer(items, overId);
      if (!activeContainer || !overContainer) return prev;

      const activeItems = items[activeContainer];
      const overItems = items[overContainer];
      const activeIndex = activeItems.indexOf(activeId);
      if (activeIndex === -1) return prev;

      if (activeContainer === overContainer) {
        const overIndex = overItems.indexOf(overId);
        if (overIndex === -1 || activeIndex === overIndex) return prev;
        return {
          ...items,
          [overContainer]: arrayMove(overItems, activeIndex, overIndex),
        };
      }

      const overIdsWithoutActive = overItems.filter((id) => id !== activeId);
      const insertIndex = getInsertIndex(event, overId, overIdsWithoutActive);
      const nextOverItems = [
        ...overIdsWithoutActive.slice(0, insertIndex),
        activeId,
        ...overIdsWithoutActive.slice(insertIndex),
      ];

      return {
        ...items,
        [activeContainer]: activeItems.filter((id) => id !== activeId),
        [overContainer]: nextOverItems,
      };
    });
  }, [storeItems]);

  const handleDragCancel = () => {
    setActiveTask(null);
    setLocalItems(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = String(active.id);
    const activeTaskData = tasksById.get(activeId);
    setActiveTask(null);

    if (!over || !activeTaskData) {
      setLocalItems(null);
      return;
    }

    const currentItems = localItems ?? storeItems;
    const sourceStatus = findContainer(storeItems, activeId);
    const targetStatus = findContainer(currentItems, activeId);

    if (!sourceStatus || !targetStatus) {
      setLocalItems(null);
      return;
    }

    if (areItemsEqual(currentItems, storeItems)) {
      setLocalItems(null);
      return;
    }

    if (sourceStatus !== targetStatus && BLOCKED_TRANSITIONS.includes(targetStatus)) {
      const blockers = getBlockersForTask(activeId);
      if (blockers.length > 0) {
        const names = blockers.map((b) => `"${b.title}"`).join(", ");
        toast.error(`Não é possível mover: bloqueada por ${names}`);
        setLocalItems(null);
        return;
      }
    }

    const targetTaskIds = currentItems[targetStatus];
    const sourceTaskIds = sourceStatus !== targetStatus ? currentItems[sourceStatus] : undefined;

    setLocalItems(null);

    updateKanbanOrder.mutate(
      {
        taskId: activeId,
        targetStatus,
        targetTaskIds,
        sourceStatus: sourceStatus !== targetStatus ? sourceStatus : undefined,
        sourceTaskIds,
      },
      {
        onSuccess: (result) => {
          if (!result.persisted) {
            toast.warning(result.message ?? "Movimento salvo localmente; backend indisponível");
          }
        },
      }
    );
  };

  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-zinc-800/50">
          <div>
            <h1 className="text-lg font-bold text-zinc-100">Quadro Kanban</h1>
            <p className="text-xs text-zinc-500">{visibleTasks.length} {visibleTasks.length === 1 ? "tarefa" : "tarefas"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={assigneeFilter} items={assigneeItems} onValueChange={(value) => setAssigneeFilter(value ?? "all")}>
              <SelectTrigger className="w-48 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-8 text-xs">
                <SelectValue placeholder="Responsável" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700/50">
                <SelectItem value="all" label="Todos">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Todos</span>
                </SelectItem>
                <SelectItem value="me" label="Minhas tarefas">
                  <Avatar className="w-4 h-4">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-[8px] bg-violet-600 text-white">{(user?.name ?? "EU").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>Minhas tarefas</span>
                </SelectItem>
                <SelectSeparator />
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id} label={u.name}>
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="text-[8px] bg-zinc-700">{u.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{u.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={projectFilter} onValueChange={(value) => setProjectFilter(value ?? "all")}>
              <SelectTrigger className="w-44 bg-zinc-800/50 border-zinc-700/50 text-zinc-300 h-8 text-xs">
                <SelectValue placeholder="Todos os projetos" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700/50">
                <SelectItem value="all">Todos os projetos</SelectItem>
                {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {canCreateTask && (
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
          {!hasLoaded ? (
            <PageLoading label="Carregando quadro..." />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <div className="flex gap-3 h-full min-h-[calc(100vh-200px)]" style={{ minWidth: `${KANBAN_STATUSES.length * 240}px` }}>
                {KANBAN_STATUSES.map((status) => (
                  <div key={status} className="flex-1 min-w-[220px] max-w-[280px]">
                    <KanbanColumn
                      status={status}
                      taskIds={itemsByStatus[status] ?? []}
                      tasksById={tasksById}
                    />
                  </div>
                ))}
              </div>

              <DragOverlay dropAnimation={null}>
                {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      {canCreateTask && <TaskCreateDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />}
    </>
  );
}
