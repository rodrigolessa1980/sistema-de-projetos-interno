"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Subtask, TimeLog, Comment, TaskDependency, StatusHistory, TaskStatus, TaskNote, TaskAttachment, ModuleAttachment } from "@/types";
import { generateId, delay } from "@/lib/utils";
import type { AuditLog } from "@/types";
import { api } from "@/lib/api";

type ApiTask = Omit<Task, "parentTaskId" | "startDate" | "dueDate" | "completedAt" | "blockedReason" | "urgentBlockedById" | "urgentPreviousStatus"> & {
  parentTaskId?: string | null;
  startDate?: string | null;
  dueDate?: string | null;
  completedAt?: string | null;
  blockedReason?: string | null;
  urgentBlockedById?: string | null;
  urgentPreviousStatus?: TaskStatus | null;
};

const TERMINAL_STATUSES: TaskStatus[] = ["CONCLUIDA", "CANCELADA"];

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

const normalizeTask = (task: ApiTask): Task => ({
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
  logTime: (data: Omit<TimeLog, "id" | "createdAt">) => Promise<TimeLog>;
  appendTimeLog: (log: TimeLog) => void;
  fetchTimeLogsForTask: (taskId: string) => Promise<void>;
  fetchTimeLogsForProject: (projectId: string) => Promise<void>;
  fetchModuleAttachmentsForProject: (projectId: string, moduleIds: string[]) => Promise<void>;
  deleteTimeLog: (id: string, taskId: string) => Promise<void>;
  addComment: (data: Omit<Comment, "id" | "createdAt" | "updatedAt">) => Promise<Comment>;
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
      .filter((t): t is Task => !!t && t.status !== "CONCLUIDA" && t.status !== "CANCELADA");
  },

  getUrgentTaskForDev: (assigneeId) =>
    get().tasks.find((t) => t.assigneeId === assigneeId && t.isUrgent && !["CONCLUIDA", "CANCELADA"].includes(t.status)),

  setTaskUrgent: (taskId, urgent) => {
    void api.patch<ApiTask>(`tasks/${taskId}/urgent`, { isUrgent: urgent }).then((updated) => {
      const normalized = normalizeTask(updated);
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === taskId ? normalized : task)),
      }));
    });
  },

  createTask: async (data) => {
    const task = normalizeTask(await api.post<ApiTask>("tasks", data));
    set((state) => ({ tasks: [...state.tasks, task] }));
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
    const updated = normalizeTask(await api.put<ApiTask>(`tasks/${id}`, { status: newStatus }));
    set((state) => ({
      tasks: TERMINAL_STATUSES.includes(newStatus)
        ? releaseUrgencyBlocksInStore(
            state.tasks.map((task) => (task.id === id ? updated : task)),
            id,
          )
        : state.tasks.map((task) => (task.id === id ? updated : task)),
    }));
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
      ...data,
      projectId: task.projectId,
      source: "MANUAL",
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
    await delay(300);
    const now = new Date().toISOString();
    const comment: Comment = { ...data, id: generateId("com"), createdAt: now, updatedAt: now };
    set((state) => ({ comments: [...state.comments, comment] }));
    return comment;
  },

  toggleSubtask: async (subtaskId) => {
    await delay(200);
    set((state) => ({
      subtasks: state.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed, updatedAt: new Date().toISOString() } : s
      ),
    }));
  },

  addSubtask: async (data) => {
    await delay(200);
    const now = new Date().toISOString();
    const subtask: Subtask = { ...data, id: generateId("sub"), createdAt: now, updatedAt: now };
    set((state) => ({ subtasks: [...state.subtasks, subtask] }));
    return subtask;
  },

  addDependency: async (data) => {
    await delay(300);
    const dep: TaskDependency = { ...data, id: generateId("dep"), createdAt: new Date().toISOString() };
    set((state) => ({ dependencies: [...state.dependencies, dep] }));
    return dep;
  },

  removeDependency: async (id) => {
    await delay(200);
    set((state) => ({ dependencies: state.dependencies.filter((d) => d.id !== id) }));
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
      set({
        tasks: projectTasks.flat().map(normalizeTask),
        isLoading: false,
      });
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
                ? targetStatus === "CONCLUIDA"
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

      if (TERMINAL_STATUSES.includes(targetStatus)) {
        nextTasks = releaseUrgencyBlocksInStore(nextTasks, taskId);
      }

      return { tasks: nextTasks };
    });
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
    await delay(200);
    const now = new Date().toISOString();
    const note: TaskNote = { ...data, id: generateId("note"), createdAt: now, updatedAt: now };
    set((state) => ({ notes: [...state.notes, note] }));
    return note;
  },

  updateNote: async (id, content) => {
    await delay(200);
    const now = new Date().toISOString();
    let updated!: TaskNote;
    set((state) => ({
      notes: state.notes.map((n) => {
        if (n.id === id) { updated = { ...n, content, updatedAt: now }; return updated; }
        return n;
      }),
    }));
    return updated;
  },

  deleteNote: async (id) => {
    await delay(150);
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
  },

  togglePinNote: async (id) => {
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n
      ),
    }));
  },

  // ── Attachments ────────────────────────────────────────────────────────────
  getAttachmentsByTask: (taskId) =>
    get().attachments
      .filter((a) => a.taskId === taskId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),

  addAttachment: async (data) => {
    await delay(300);
    const attachment: TaskAttachment = {
      ...data,
      id: generateId("att"),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ attachments: [...state.attachments, attachment] }));
    return attachment;
  },

  deleteAttachment: async (id) => {
    await delay(150);
    set((state) => ({ attachments: state.attachments.filter((a) => a.id !== id) }));
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
    // Persist local workflow edits until task endpoints replace the mock-backed store.
    partialize: (state) => ({
      tasks: state.tasks,
      statusHistory: state.statusHistory,
      auditLogs: state.auditLogs,
      notes: state.notes,
      attachments: state.attachments,
      // moduleAttachments e timeLogs vêm do backend
    }),
  }
));
