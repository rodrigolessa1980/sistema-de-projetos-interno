"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Subtask, TimeLog, Comment, TaskDependency, StatusHistory, TaskStatus, TaskNote, TaskAttachment } from "@/types";
import {
  mockTasks, mockSubtasks, mockTimeLogs, mockComments,
  mockDependencies, mockStatusHistory, mockTaskNotes, mockTaskAttachments,
} from "@/mocks";
import { generateId, delay } from "@/lib/utils";
import { mockAuditLogs } from "@/mocks/notifications";
import type { AuditLog } from "@/types";

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

  createTask: (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<Task>;
  updateTaskStatus: (id: string, newStatus: TaskStatus, userId: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  logTime: (data: Omit<TimeLog, "id" | "createdAt">) => Promise<TimeLog>;
  addComment: (data: Omit<Comment, "id" | "createdAt" | "updatedAt">) => Promise<Comment>;
  toggleSubtask: (subtaskId: string) => Promise<void>;
  addSubtask: (data: Omit<Subtask, "id" | "createdAt" | "updatedAt">) => Promise<Subtask>;
  addDependency: (data: Omit<TaskDependency, "id" | "createdAt">) => Promise<TaskDependency>;
  removeDependency: (id: string) => Promise<void>;
  setSelectedTask: (id: string | null) => void;
  reorderTasks: (projectId: string, status: TaskStatus, taskIds: string[]) => void;

  // Notes
  getNotesByTask: (taskId: string) => TaskNote[];
  addNote: (data: Omit<TaskNote, "id" | "createdAt" | "updatedAt">) => Promise<TaskNote>;
  updateNote: (id: string, content: string) => Promise<TaskNote>;
  deleteNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;

  // Attachments
  getAttachmentsByTask: (taskId: string) => TaskAttachment[];
  addAttachment: (data: Omit<TaskAttachment, "id" | "createdAt">) => Promise<TaskAttachment>;
  deleteAttachment: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>()(
  persist(
  (set, get) => ({
  tasks: [...mockTasks],
  subtasks: [...mockSubtasks],
  timeLogs: [...mockTimeLogs],
  comments: [...mockComments],
  dependencies: [...mockDependencies],
  statusHistory: [...mockStatusHistory],
  auditLogs: [...mockAuditLogs],
  notes: [...mockTaskNotes],
  attachments: [...mockTaskAttachments],
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

  createTask: async (data) => {
    await delay(500);
    const now = new Date().toISOString();
    const task: Task = { ...data, id: generateId("task"), createdAt: now, updatedAt: now };
    set((state) => ({ tasks: [...state.tasks, task] }));
    return task;
  },

  updateTask: async (id, data) => {
    await delay(300);
    const now = new Date().toISOString();
    let updated!: Task;
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === id) { updated = { ...t, ...data, updatedAt: now }; return updated; }
        return t;
      }),
    }));
    return updated;
  },

  updateTaskStatus: async (id, newStatus, userId) => {
    await delay(300);
    const now = new Date().toISOString();
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const REQUIRES_UNBLOCKED: TaskStatus[] = ["EM_DESENVOLVIMENTO", "EM_REVISAO", "HOMOLOGACAO", "CONCLUIDA"];
    if (REQUIRES_UNBLOCKED.includes(newStatus)) {
      const blockers = get().getBlockersForTask(id);
      if (blockers.length > 0) {
        const names = blockers.map((b) => `"${b.title}"`).join(", ");
        throw new Error(`Esta tarefa está bloqueada. Conclua primeiro: ${names}`);
      }
    }

    const historyEntry: StatusHistory = {
      id: generateId("sh"),
      taskId: id,
      fromStatus: task.status,
      toStatus: newStatus,
      userId,
      duration: 0,
      createdAt: now,
    };

    const auditEntry: AuditLog = {
      id: generateId("audit"),
      entityType: "TASK",
      entityId: id,
      action: "STATUS_CHANGED",
      userId,
      previousValue: { status: task.status },
      newValue: { status: newStatus },
      description: `Status alterado de ${task.status} para ${newStatus}`,
      createdAt: now,
    };

    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: newStatus, updatedAt: now, completedAt: newStatus === "CONCLUIDA" ? now : t.completedAt } : t
      ),
      statusHistory: [...state.statusHistory, historyEntry],
      auditLogs: [...state.auditLogs, auditEntry],
    }));

    if (newStatus === "CONCLUIDA") {
      const dependentTasks = get().dependencies
        .filter((d) => d.dependsOnTaskId === id && d.type === "BLOCKED_BY")
        .map((d) => d.taskId);

      for (const depTaskId of dependentTasks) {
        const isStillBlocked = get().isTaskBlocked(depTaskId);
        if (!isStillBlocked) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === depTaskId && t.status === "BLOQUEADA"
                ? { ...t, status: "PLANEJADA", blockedReason: undefined, updatedAt: now }
                : t
            ),
          }));
        }
      }
    }
  },

  deleteTask: async (id) => {
    await delay(300);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  logTime: async (data) => {
    await delay(300);
    const now = new Date().toISOString();
    const log: TimeLog = { ...data, id: generateId("tl"), createdAt: now };
    set((state) => {
      const taskLogs = state.timeLogs.filter((tl) => tl.taskId === data.taskId);
      const totalHours = taskLogs.reduce((acc, tl) => acc + tl.hours, 0) + data.hours;
      return {
        timeLogs: [...state.timeLogs, log],
        tasks: state.tasks.map((t) =>
          t.id === data.taskId ? { ...t, actualHours: totalHours, updatedAt: now } : t
        ),
      };
    });
    return log;
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

  reorderTasks: (projectId, status, taskIds) => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.projectId !== projectId || task.status !== status) return task;
        const newOrder = taskIds.indexOf(task.id);
        return newOrder !== -1 ? { ...task, order: newOrder } : task;
      }),
    }));
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
  }),
  {
    name: "devflow-tasks",
    // Persiste apenas notas e anexos (dados mutáveis pelo usuário)
    partialize: (state) => ({
      notes: state.notes,
      attachments: state.attachments,
      timeLogs: state.timeLogs,
    }),
  }
));
