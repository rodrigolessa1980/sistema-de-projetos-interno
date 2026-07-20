"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { safeLocalStorage } from "@/lib/safe-storage";
import type { Task, Subtask, TimeLog, Comment, TaskDependency, StatusHistory, TaskStatus, TaskNote, TaskAttachment, ModuleAttachment } from "@/types";
import { isTerminal, isOpen, isDone } from "@/lib/utils";
import type { AuditLog } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useWorkSessionStore } from "@/stores/work-session-store";
import { createDirtyTracker, replacePreservingDirty, upsertById } from "@/lib/reconcile";

/**
 * Ids de tasks com mutação otimista em voo (INC-03). Compartilhado com o delta sync
 * (INC-12) para que um poll/refetch nunca sobrescreva uma edição local pendente.
 */
export const taskDirty = createDirtyTracker();

type ApiTask = Omit<Task, "parentTaskId" | "startDate" | "dueDate" | "completedAt" | "blockedReason" | "urgentBlockedById" | "urgentPreviousStatus"> & {
  parentTaskId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
  blockedReason?: string | null;
  urgentBlockedById?: string | null;
  urgentPreviousStatus?: TaskStatus | null;
};

const shouldStopTimerForStatus = (taskId: string, status: TaskStatus): boolean => {
  const activeSession = useWorkSessionStore.getState().activeSession;
  return isTerminal(status) && activeSession?.taskId === taskId;
};

const stopActiveTimerForTask = async (taskId: string, status: TaskStatus, description: string) => {
  if (!shouldStopTimerForStatus(taskId, status)) return;
  const result = await useWorkSessionStore.getState().stopSession(description);
  if (result) {
    useTaskStore.getState().appendTimeLog(result.timeLog);
  }
};

const releaseUrgencyBlocksInStore = (tasks: Task[], urgentTaskId: string): Task[] =>
  tasks.map((task) => {
    if (task.urgentBlockedById !== urgentTaskId) return task;
    return {
      ...task,
      status: task.status === "BLOQUEADA" ? (task.urgentPreviousStatus ?? "BACKLOG") : task.status,
      urgentBlockedById: undefined,
      urgentPreviousStatus: undefined,
      blockedReason: undefined,
    };
  });

export const normalizeTask = (task: ApiTask): Task => ({
  ...task,
  parentTaskId: task.parentTaskId ?? undefined,
  startDate: task.startDate ?? undefined,
  dueDate: task.dueDate ?? undefined,
  completedAt: task.completedAt ?? undefined,
  blockedReason: task.blockedReason ?? undefined,
  urgentBlockedById: task.urgentBlockedById ?? undefined,
  urgentPreviousStatus: task.urgentPreviousStatus ?? undefined,
  dependencyIds: task.dependencyIds ?? [],
  tags: task.tags ?? [],
});

export const toCreateTaskPayload = (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => ({
  projectId: data.projectId,
  moduleId: data.moduleId,
  epicId: data.epicId,
  parentTaskId: data.parentTaskId,
  title: data.title,
  description: data.description,
  status: data.status,
  complexity: data.complexity,
  assigneeId: data.assigneeId,
  reporterId: data.reporterId,
  estimatedHours: data.estimatedHours,
  actualHours: data.actualHours,
  startDate: data.startDate,
  dueDate: data.dueDate,
  order: data.order,
  blockedReason: data.blockedReason,
  isUrgent: data.isUrgent,
});

interface TaskStore {
  tasks: Task[];
  subtasks: Subtask[];
  timeLogs: TimeLog[];
  comments: Comment[];
  dependencies: TaskDependency[];
  statusHistory: StatusHistory[];
  auditLogs: AuditLog[];
  notes: TaskNote[];
  attachments: TaskAttachment[];
  isLoading: boolean;
  /** True após a 1ª carga (bootstrap/timelogs). Gate anti "falso vazio". */
  hasLoaded: boolean;
  selectedTaskId: string | null;

  getTaskById: (id: string) => Task | undefined;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByAssignee: (userId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getSubtasksByTask: (taskId: string) => Subtask[];
  getTimeLogsByTask: (taskId: string) => TimeLog[];
  getCommentsByTask: (taskId: string) => Comment[];
  getDependenciesByTask: (taskId: string) => TaskDependency[];
  getBlockedTasks: () => Task[];
  isTaskBlocked: (taskId: string) => boolean;
  getBlockersForTask: (taskId: string) => Task[];
  getUrgentTaskForDev: (assigneeId: string) => Task | undefined;
  setTaskUrgent: (taskId: string, urgent: boolean) => void;

  createTask: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>;
  updateTaskStatus: (id: string, newStatus: TaskStatus, userId: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  logTime: (data: Omit<TimeLog, "id" | "createdAt" | "userId">) => Promise<TimeLog>;
  appendTimeLog: (log: TimeLog) => void;
  fetchTimeLogsForTask: (taskId: string) => Promise<void>;
  fetchTimeLogsForProject: (projectId: string) => Promise<void>;
  fetchAllTimeLogs: () => Promise<void>;
  fetchModuleAttachmentsForProject: (projectId: string, moduleIds: string[]) => Promise<void>;
  deleteTimeLog: (id: string, taskId: string) => Promise<void>;
  addComment: (data: Omit<Comment, "id" | "createdAt" | "updatedAt">) => Promise<Comment>;
  updateComment: (id: string, content: string) => Promise<Comment>;
  deleteComment: (id: string) => Promise<void>;
  toggleSubtask: (subtaskId: string) => Promise<void>;
  addSubtask: (data: Omit<Subtask, "id" | "createdAt" | "updatedAt">) => Promise<Subtask>;
  addDependency: (data: Omit<TaskDependency, "id" | "createdAt">) => Promise<TaskDependency>;
  removeDependency: (id: string) => Promise<void>;
  setSelectedTask: (id: string | null) => void;
  fetchTasksForProjects: (projectIds: string[]) => Promise<void>;
  reorderTasks: (projectId: string, status: TaskStatus, taskIds: string[]) => void;
  applyKanbanOrder: (data: {
    taskId: string;
    targetStatus: TaskStatus;
    targetTaskIds: string[];
    sourceStatus?: TaskStatus;
    sourceTaskIds?: string[];
  }) => void;

  // Notes
  getNotesByTask: (taskId: string) => TaskNote[];
  addNote: (data: Omit<TaskNote, "id" | "createdAt" | "updatedAt">) => Promise<TaskNote>;
  updateNote: (id: string, content: string) => Promise<TaskNote>;
  deleteNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;

  // Attachments (Tasks)
  getAttachmentsByTask: (taskId: string) => TaskAttachment[];
  fetchAttachmentsForTask: (taskId: string) => Promise<void>;
  addAttachment: (data: Omit<TaskAttachment, "id" | "createdAt">) => Promise<TaskAttachment>;
  deleteAttachment: (id: string) => Promise<void>;

  // Attachments (Modules)
  moduleAttachments: ModuleAttachment[];
  getAttachmentsByModule: (moduleId: string) => ModuleAttachment[];
  addModuleAttachment: (data: Omit<ModuleAttachment, "id" | "createdAt">) => Promise<ModuleAttachment>;
  deleteModuleAttachment: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>()(
  persist(
  (set, get) => ({
  tasks: [],
  subtasks: [],
  timeLogs: [],
  comments: [],
  dependencies: [],
  statusHistory: [],
  auditLogs: [],
  notes: [],
  attachments: [],
  moduleAttachments: [],
  isLoading: false,
  hasLoaded: false,
  selectedTaskId: null,

  getTaskById: (id) => get().tasks.find((t) => t.id === id),
  getTasksByProject: (projectId) => get().tasks.filter((t) => t.projectId === projectId),
  getTasksByAssignee: (userId) => get().tasks.filter((t) => t.assigneeId === userId),
  getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),
  getSubtasksByTask: (taskId) => get().subtasks.filter((s) => s.taskId === taskId),
  getTimeLogsByTask: (taskId) => get().timeLogs.filter((tl) => tl.taskId === taskId),
  getCommentsByTask: (taskId) => get().comments.filter((c) => c.taskId === taskId),
  getDependenciesByTask: (taskId) => get().dependencies.filter((d) => d.taskId === taskId || d.dependsOnTaskId === taskId),
  getBlockedTasks: () => get().tasks.filter((t) => t.status === "BLOQUEADA"),

  isTaskBlocked: (taskId) => {
    return get().getBlockersForTask(taskId).length > 0;
  },

  getBlockersForTask: (taskId) => {
    const deps = get().dependencies.filter((d) => d.taskId === taskId && d.type === "BLOCKED_BY");
    return deps
      .map((dep) => get().tasks.find((t) => t.id === dep.dependsOnTaskId))
      .filter((t): t is Task => !!t && isOpen(t.status));
  },

  getUrgentTaskForDev: (assigneeId) =>
    get().tasks.find((t) => t.assigneeId === assigneeId && t.isUrgent && isOpen(t.status)),

  setTaskUrgent: (taskId, urgent) => {
    void api.patch<ApiTask>(`tasks/${taskId}/urgent`, { isUrgent: urgent }).then((updated) => {
      const normalized = normalizeTask(updated);
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === taskId ? normalized : task)),
      }));
    }).catch(() => {
      toast.error("Não foi possível atualizar a urgência da tarefa.");
    });
  },

  createTask: async (data) => {
    const task = normalizeTask(await api.post<ApiTask>("tasks", toCreateTaskPayload(data)));
    // upsertById em vez de append: se o delta-sync já inseriu (POST lento), não duplica.
    set((state) => ({ tasks: upsertById(state.tasks, task) }));
    return task;
  },

  updateTask: async (id, data) => {
    const updated = normalizeTask(await api.put<ApiTask>(`tasks/${id}`, data));
    set((state) => ({
      tasks: state.tasks.map((task) => task.id === id ? updated : task),
    }));
    return updated;
  },

  updateTaskStatus: async (id, newStatus, userId) => {
    void userId;
    taskDirty.markDirty(id);
    const updated = normalizeTask(
      await api.put<ApiTask>(`tasks/${id}`, { status: newStatus }).finally(() => taskDirty.clearDirty(id)),
    );
    set((state) => ({
      tasks: isTerminal(newStatus)
        ? releaseUrgencyBlocksInStore(
            state.tasks.map((task) => (task.id === id ? updated : task)),
            id,
          )
        : state.tasks.map((task) => (task.id === id ? updated : task)),
    }));
    await stopActiveTimerForTask(id, newStatus, "Tarefa finalizada");
  },

  deleteTask: async (id) => {
    await api.delete(`tasks/${id}`);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  logTime: async (data) => {
    const task = get().tasks.find((item) => item.id === data.taskId);
    if (!task) {
      throw new Error("Task não encontrada para registrar tempo");
    }
    const log = await api.post<TimeLog>("time-logs", {
      projectId: task.projectId,
      taskId: data.taskId,
      hours: data.hours,
      description: data.description,
      date: data.date,
      status: data.status,
      source: data.source ?? "MANUAL",
    });
    get().appendTimeLog(log);
    // Atualiza actualHours da task com o valor retornado pelo backend
    await get().fetchTimeLogsForTask(data.taskId);
    return log;
  },

  appendTimeLog: (log) => {
    set((state) => {
      const taskLogs = [...state.timeLogs.filter((tl) => tl.id !== log.id), log];
      const totalHours = taskLogs
        .filter((tl) => tl.taskId === log.taskId)
        .reduce((acc, tl) => acc + tl.hours, 0);
      return {
        timeLogs: taskLogs,
        tasks: state.tasks.map((t) =>
          t.id === log.taskId ? { ...t, actualHours: totalHours } : t
        ),
      };
    });
  },

  fetchTimeLogsForTask: async (taskId) => {
    const logs = await api.get<TimeLog[]>(`time-logs/task/${taskId}`);
    const finalized = logs.filter((l) => l.endedAt !== undefined && l.endedAt !== null);
    const totalHours = finalized.reduce((sum, l) => sum + l.hours, 0);
    set((state) => ({
      timeLogs: [
        ...state.timeLogs.filter((tl) => tl.taskId !== taskId),
        ...finalized.map((log) => ({
          ...log,
          date: log.date.split("T")[0],
        })),
      ],
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, actualHours: totalHours } : t
      ),
    }));
  },

  fetchTimeLogsForProject: async (projectId) => {
    const logs = await api.get<TimeLog[]>(`time-logs/project/${projectId}`).catch(() => [] as TimeLog[]);
    const normalized = logs.map((log) => ({
      ...log,
      date: log.date.split("T")[0],
    }));
    set((state) => ({
      timeLogs: [
        ...state.timeLogs.filter((tl) => tl.projectId !== projectId),
        ...normalized,
      ],
    }));
  },

  fetchAllTimeLogs: async () => {
    // Admin recebe todos os registros; demais usuários, só os próprios (regra do backend).
    const logs = await api.get<TimeLog[]>("time-logs").catch(() => [] as TimeLog[]);
    const normalized = logs.map((log) => ({ ...log, date: log.date.split("T")[0] }));
    set({ timeLogs: normalized, hasLoaded: true });
  },

  fetchModuleAttachmentsForProject: async (projectId, moduleIds) => {
    const moduleIdSet = new Set(moduleIds);
    const response = await api
      .get<{ attachments: ModuleAttachment[] }>(`projects/${projectId}/module-attachments`)
      .catch(() => ({ attachments: [] as ModuleAttachment[] }));
    set((state) => ({
      moduleAttachments: [
        ...state.moduleAttachments.filter((a) => !moduleIdSet.has(a.moduleId)),
        ...response.attachments,
      ],
    }));
  },

  deleteTimeLog: async (id, taskId) => {
    await api.delete(`time-logs/${id}`);
    set((state) => ({
      timeLogs: state.timeLogs.filter((tl) => tl.id !== id),
    }));
    await get().fetchTimeLogsForTask(taskId);
  },

  addComment: async (data) => {
    // Otimista: mostra o comentário na hora (sensação instantânea) e reconcilia
    // com a versão do servidor; remove se falhar. A UI limpa o input no envio,
    // então um 2º Enter não duplica (a causa dos "neuro divergente" repetidos).
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date().toISOString();
    const optimistic: Comment = {
      ...data,
      mentions: data.mentions ?? [],
      id: tempId,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ comments: [...state.comments, optimistic] }));
    try {
      const saved = await api.post<Comment>(`tasks/${data.taskId}/comments`, {
        content: data.content,
        mentions: data.mentions ?? [],
      });
      set((state) => ({ comments: state.comments.map((c) => (c.id === tempId ? saved : c)) }));
      return saved;
    } catch (error) {
      set((state) => ({ comments: state.comments.filter((c) => c.id !== tempId) }));
      throw error instanceof Error ? error : new Error("Erro ao comentar");
    }
  },

  updateComment: async (id, content) => {
    const updated = await api.patch<Comment>(`tasks/comments/${id}`, { content });
    set((state) => ({ comments: state.comments.map((c) => (c.id === id ? updated : c)) }));
    return updated;
  },

  deleteComment: async (id) => {
    // Soft delete: o backend retorna o comentário marcado (deletedAt) — mantém na
    // thread como "apagado" em vez de sumir; fica no log de auditoria.
    const updated = await api.delete<Comment>(`tasks/comments/${id}`);
    set((state) => ({ comments: state.comments.map((c) => (c.id === id ? updated : c)) }));
  },

  toggleSubtask: async (subtaskId) => {
    const current = get().subtasks.find((s) => s.id === subtaskId);
    if (!current) return;
    // Otimista: alterna já; reverte se o backend recusar.
    const previous = get().subtasks;
    set((state) => ({
      subtasks: state.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s,
      ),
    }));
    try {
      const updated = await api.patch<Subtask>(`tasks/subtasks/${subtaskId}`, {
        completed: !current.completed,
      });
      set((state) => ({ subtasks: state.subtasks.map((s) => (s.id === subtaskId ? updated : s)) }));
    } catch (error) {
      set({ subtasks: previous });
      throw error instanceof Error ? error : new Error("Erro ao atualizar subtarefa");
    }
  },

  addSubtask: async (data) => {
    const subtask = await api.post<Subtask>(`tasks/${data.taskId}/subtasks`, {
      title: data.title,
      assigneeId: data.assigneeId ?? null,
    });
    set((state) => ({ subtasks: [...state.subtasks, subtask] }));
    return subtask;
  },

  addDependency: async (data) => {
    const dep = await api.post<TaskDependency>(`tasks/${data.taskId}/dependencies`, {
      dependsOnTaskId: data.dependsOnTaskId,
      type: data.type,
    });
    set((state) => ({ dependencies: [...state.dependencies, dep] }));
    return dep;
  },

  removeDependency: async (id) => {
    const previous = get().dependencies;
    set((state) => ({ dependencies: state.dependencies.filter((d) => d.id !== id) }));
    try {
      await api.delete(`tasks/dependencies/${id}`);
    } catch (error) {
      set({ dependencies: previous });
      throw error instanceof Error ? error : new Error("Erro ao remover dependência");
    }
  },

  setSelectedTask: (id) => set({ selectedTaskId: id }),

  fetchTasksForProjects: async (projectIds) => {
    const uniqueProjectIds = Array.from(new Set(projectIds.filter(Boolean)));
    if (uniqueProjectIds.length === 0) {
      set({ tasks: [] });
      return;
    }

    set({ isLoading: true });
    try {
      const projectTasks = await Promise.all(
        uniqueProjectIds.map((projectId) =>
          api.get<ApiTask[]>(`tasks/project/${projectId}`).catch(() => [] as ApiTask[])
        )
      );
      const incoming = projectTasks.flat().map(normalizeTask);
      // Replace do servidor (fonte de verdade), preservando itens com edição otimista
      // em voo (dirty) para não engolir o que o usuário acabou de mexer. Ver INC-03.
      set((state) => ({
        tasks: replacePreservingDirty(state.tasks, incoming, taskDirty.ids),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  reorderTasks: (projectId, status, taskIds) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.projectId !== projectId || task.status !== status) return task;
        const newOrder = taskIds.indexOf(task.id);
        return newOrder !== -1 ? { ...task, order: newOrder } : task;
      }),
    }));
    const movedTaskId = taskIds[0];
    if (movedTaskId) {
      void api.patch("tasks/kanban/order", {
        taskId: movedTaskId,
        targetStatus: status,
        targetTaskIds: taskIds,
      }).catch(() => {
        // fallback local otimista
        toast.error("Não foi possível salvar a nova ordem do quadro.");
      });
    }
  },

  applyKanbanOrder: ({ taskId, targetStatus, targetTaskIds, sourceStatus, sourceTaskIds = [] }) => {
    const now = new Date().toISOString();
    const targetOrder = new Map(targetTaskIds.map((id, index) => [id, index]));
    const sourceOrder = new Map(sourceTaskIds.map((id, index) => [id, index]));

    set((state) => {
      let nextTasks = state.tasks.map((task) => {
        const targetIndex = targetOrder.get(task.id);
        if (targetIndex !== undefined) {
          return {
            ...task,
            status: targetStatus,
            order: targetIndex,
            updatedAt: now,
            completedAt:
              task.id === taskId
                ? isDone(targetStatus)
                  ? now
                  : undefined
                : task.completedAt,
          };
        }

        const sourceIndex = sourceOrder.get(task.id);
        if (sourceStatus && sourceIndex !== undefined) {
          return {
            ...task,
            status: sourceStatus,
            order: sourceIndex,
            updatedAt: now,
          };
        }

        return task;
      });

      if (isTerminal(targetStatus)) {
        nextTasks = releaseUrgencyBlocksInStore(nextTasks, taskId);
      }

      return { tasks: nextTasks };
    });

    void stopActiveTimerForTask(taskId, targetStatus, "Tarefa finalizada pelo Kanban");
  },

  // ── Notes ─────────────────────────────────────────────────────────────────
  getNotesByTask: (taskId) =>
    get().notes
      .filter((n) => n.taskId === taskId)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }),

  addNote: async (data) => {
    const note = await api.post<TaskNote>(`tasks/${data.taskId}/notes`, {
      content: data.content,
    });
    set((state) => ({ notes: [...state.notes, note] }));
    return note;
  },

  updateNote: async (id, content) => {
    const updated = await api.patch<TaskNote>(`tasks/notes/${id}`, { content });
    set((state) => ({ notes: state.notes.map((n) => (n.id === id ? updated : n)) }));
    return updated;
  },

  deleteNote: async (id) => {
    const previous = get().notes;
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
    try {
      await api.delete(`tasks/notes/${id}`);
    } catch (error) {
      set({ notes: previous });
      throw error instanceof Error ? error : new Error("Erro ao remover anotação");
    }
  },

  togglePinNote: async (id) => {
    const current = get().notes.find((n) => n.id === id);
    if (!current) return;
    const previous = get().notes;
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)),
    }));
    try {
      const updated = await api.patch<TaskNote>(`tasks/notes/${id}`, { isPinned: !current.isPinned });
      set((state) => ({ notes: state.notes.map((n) => (n.id === id ? updated : n)) }));
    } catch (error) {
      set({ notes: previous });
      throw error instanceof Error ? error : new Error("Erro ao fixar anotação");
    }
  },

  // ── Attachments ────────────────────────────────────────────────────────────
  getAttachmentsByTask: (taskId) =>
    get().attachments
      .filter((a) => a.taskId === taskId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  fetchAttachmentsForTask: async (taskId) => {
    const response = await api
      .get<{ attachments: TaskAttachment[] }>(`tasks/${taskId}/attachments`)
      .catch(() => ({ attachments: [] as TaskAttachment[] }));
    set((state) => ({
      attachments: [
        ...state.attachments.filter((a) => a.taskId !== taskId),
        ...(response.attachments ?? []),
      ],
    }));
  },

  addAttachment: async (data) => {
    const response = await api.post<{ attachment: TaskAttachment }>(
      `tasks/${data.taskId}/attachments`,
      { name: data.name, type: data.type, size: data.size, dataUrl: data.dataUrl },
    );
    const attachment = response.attachment;
    set((state) => ({ attachments: [...state.attachments, attachment] }));
    return attachment;
  },

  deleteAttachment: async (id) => {
    const previous = get().attachments;
    set((state) => ({ attachments: state.attachments.filter((a) => a.id !== id) }));
    try {
      await api.delete(`tasks/attachments/${id}`);
    } catch (error) {
      set({ attachments: previous });
      throw error instanceof Error ? error : new Error("Erro ao remover anexo");
    }
  },

  // ── Module Attachments ─────────────────────────────────────────────────────
  getAttachmentsByModule: (moduleId) =>
    get().moduleAttachments
      .filter((a) => a.moduleId === moduleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  addModuleAttachment: async (data) => {
    const response = await api.post<{ attachment: ModuleAttachment }>(
      `modules/${data.moduleId}/attachments`,
      {
        name: data.name,
        type: data.type,
        size: data.size,
        dataUrl: data.dataUrl,
      },
    );
    const attachment = response.attachment;
    set((state) => ({ moduleAttachments: [...state.moduleAttachments, attachment] }));
    return attachment;
  },

  deleteModuleAttachment: async (id) => {
    const previous = get().moduleAttachments;
    set((state) => ({ moduleAttachments: state.moduleAttachments.filter((a) => a.id !== id) }));
    try {
      await api.delete(`module-attachments/${id}`);
    } catch {
      set({ moduleAttachments: previous });
      throw new Error("Erro ao remover anexo");
    }
  },
  }),
  {
    name: "devflow-tasks",
    storage: createJSONStorage(() => safeLocalStorage),
    version: 3,
    // v2: `attachments` saiu do persist (base64 estourava a cota do localStorage).
    // v3: `notes` saiu do persist — agora é server-state (vem do /bootstrap), não
    // mais mock local. Limpa o resíduo antigo de ambos.
    migrate: (persisted) => {
      const state = (persisted ?? {}) as Record<string, unknown>;
      delete state.attachments;
      delete state.notes;
      return state;
    },
    // INC-07: só persistimos dados LOCAIS não sincronizados. `tasks`, `notes`,
    // `comments`, `subtasks`, `dependencies` e anexos vêm do backend (bootstrap/
    // delta sync); persistir fazia o reload pintar dado velho antes do fetch.
    partialize: (state) => ({
      // Logs locais são capados às últimas 200 entradas: crescem sem limite e
      // encheriam o localStorage devagar. Mantemos só o recente ("o necessário").
      statusHistory: state.statusHistory.slice(-200),
      auditLogs: state.auditLogs.slice(-200),
    }),
  }
));
