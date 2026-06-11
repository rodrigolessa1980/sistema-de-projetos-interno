"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { TaskStatus, TimeLog } from "@/types";

export interface WorkSession {
  id: string;
  taskId: string;
  userId: string;
  startedAt: string;
  description?: string;
}

interface TrackerTimeLog {
  id: string;
  projectId: string;
  taskId: string;
  userId: string;
  hours: number;
  durationSeconds: number | null;
  description: string;
  date: string;
  startedAt: string | null;
  endedAt: string | null;
  status: TaskStatus;
  createdAt: string;
}

const toWorkSession = (log: TrackerTimeLog): WorkSession => ({
  id: log.id,
  taskId: log.taskId,
  userId: log.userId,
  startedAt: log.startedAt ?? log.createdAt,
});

const toTimeLog = (log: TrackerTimeLog): TimeLog => ({
  id: log.id,
  projectId: log.projectId,
  taskId: log.taskId,
  userId: log.userId,
  hours: log.hours,
  durationSeconds: log.durationSeconds,
  description: log.description,
  date: log.date.split("T")[0],
  startedAt: log.startedAt,
  endedAt: log.endedAt,
  status: log.status,
  createdAt: log.createdAt,
});

interface WorkSessionStore {
  activeSession: WorkSession | null;
  isSyncing: boolean;

  syncFromServer: () => Promise<void>;
  startSession: (input: { taskId: string; userId: string; projectId: string; status?: TaskStatus }) => Promise<WorkSession>;
  stopSession: (description?: string) => Promise<{ elapsedSeconds: number; hours: number; timeLog: TimeLog } | null>;
  cancelSession: () => Promise<void>;
  clearSession: () => void;
  isWorking: (taskId: string) => boolean;
  getElapsedSeconds: () => number;
}

export const useWorkSessionStore = create<WorkSessionStore>()((set, get) => ({
  activeSession: null,
  isSyncing: false,

  syncFromServer: async () => {
    set({ isSyncing: true });
    try {
      const active = await api.get<TrackerTimeLog | null>("time-logs/tracker/active");
      set({ activeSession: active ? toWorkSession(active) : null });
    } catch {
      // Mantém estado atual se a API estiver indisponível
    } finally {
      set({ isSyncing: false });
    }
  },

  startSession: async ({ taskId, projectId, status = "EM_DESENVOLVIMENTO" }) => {
    const log = await api.post<TrackerTimeLog>("time-logs/tracker/start", {
      projectId,
      taskId,
      status,
    });
    const session = toWorkSession(log);
    set({ activeSession: session });
    return session;
  },

  stopSession: async (description = "Trabalho realizado") => {
    const { activeSession } = get();
    if (!activeSession) return null;

    const startedAt = new Date(activeSession.startedAt).getTime();
    const log = await api.post<TrackerTimeLog>("time-logs/tracker/stop", { description });
    const endedAt = log.endedAt ? new Date(log.endedAt).getTime() : Date.now();
    const elapsedSeconds = log.durationSeconds ?? Math.max(1, Math.floor((endedAt - startedAt) / 1000));

    set({ activeSession: null });
    return {
      elapsedSeconds,
      hours: log.hours,
      timeLog: toTimeLog(log),
    };
  },

  cancelSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return;

    try {
      await api.delete(`time-logs/${activeSession.id}`);
    } catch {
      // Se já foi removido no servidor, apenas limpa o estado local
    }
    set({ activeSession: null });
  },

  clearSession: () => set({ activeSession: null }),

  isWorking: (taskId) => get().activeSession?.taskId === taskId,

  getElapsedSeconds: () => {
    const { activeSession } = get();
    if (!activeSession) return 0;
    return Math.floor((Date.now() - new Date(activeSession.startedAt).getTime()) / 1000);
  },
}));
