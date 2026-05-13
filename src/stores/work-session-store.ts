"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "@/lib/utils";

export interface WorkSession {
  id: string;
  taskId: string;
  userId: string;
  startedAt: string;
  /** Descrição opcional preenchida ao pausar/finalizar */
  description?: string;
}

interface WorkSessionStore {
  /** Sessão atualmente ativa (apenas uma por vez por usuário) */
  activeSession: WorkSession | null;
  /** Histórico de sessões finalizadas nesta aba (memória da sessão do navegador) */
  finishedSessions: Array<WorkSession & { endedAt: string; elapsedSeconds: number }>;

  startSession: (taskId: string, userId: string) => WorkSession;
  stopSession: (description?: string) => { elapsedSeconds: number; hours: number } | null;
  cancelSession: () => void;
  isWorking: (taskId: string) => boolean;
  getElapsedSeconds: () => number;
}

export const useWorkSessionStore = create<WorkSessionStore>()(
  persist(
    (set, get) => ({
      activeSession: null,
      finishedSessions: [],

      startSession: (taskId, userId) => {
        // Garante que só existe uma sessão ativa por vez
        const session: WorkSession = {
          id: generateId("ws"),
          taskId,
          userId,
          startedAt: new Date().toISOString(),
        };
        set({ activeSession: session });
        return session;
      },

      stopSession: (description) => {
        const { activeSession } = get();
        if (!activeSession) return null;

        const endedAt = new Date().toISOString();
        const elapsedMs = new Date(endedAt).getTime() - new Date(activeSession.startedAt).getTime();
        const elapsedSeconds = Math.floor(elapsedMs / 1000);
        // Arredondar para 0.25h mínimo, precisão de 0.25h
        const rawHours = elapsedMs / 3_600_000;
        const hours = Math.max(0.25, Math.round(rawHours * 4) / 4);

        set((state) => ({
          activeSession: null,
          finishedSessions: [
            ...state.finishedSessions,
            { ...activeSession, description, endedAt, elapsedSeconds },
          ],
        }));

        return { elapsedSeconds, hours };
      },

      cancelSession: () => set({ activeSession: null }),

      isWorking: (taskId) => get().activeSession?.taskId === taskId,

      getElapsedSeconds: () => {
        const { activeSession } = get();
        if (!activeSession) return 0;
        return Math.floor((Date.now() - new Date(activeSession.startedAt).getTime()) / 1000);
      },
    }),
    {
      name: "devflow-work-session",
      // Persiste apenas a sessão ativa para sobreviver a refreshes
      partialize: (state) => ({ activeSession: state.activeSession }),
    }
  )
);
