"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useWorkSessionStore } from "@/stores/work-session-store";
import { useTaskStore } from "@/stores/task-store";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

/** Formata segundos em HH:MM:SS */
export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

/** Hook principal de controle de sessão de trabalho */
export function useWorkSession(taskId: string) {
  const { user } = useAuth();
  const { activeSession, startSession, stopSession, cancelSession, isWorking, getElapsedSeconds } =
    useWorkSessionStore();
  const { appendTimeLog, updateTaskStatus, getTaskById } = useTaskStore();

  const isActive = isWorking(taskId);
  const [elapsed, setElapsed] = useState(() => (isActive ? getElapsedSeconds() : 0));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const initialTick = setTimeout(() => setElapsed(getElapsedSeconds()), 0);
    intervalRef.current = setInterval(() => {
      setElapsed(getElapsedSeconds());
    }, 1000);

    return () => {
      clearTimeout(initialTick);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, getElapsedSeconds]);

  const start = useCallback(async () => {
    if (!user) return;

    if (activeSession && activeSession.taskId !== taskId) {
      toast.error("Finalize o trabalho na task atual antes de iniciar outra.");
      return;
    }

    const task = getTaskById(taskId);
    if (!task) return;

    try {
      if (task.status !== "EM_DESENVOLVIMENTO") {
        await updateTaskStatus(taskId, "EM_DESENVOLVIMENTO", user.id);
      }

      await startSession({
        taskId,
        userId: user.id,
        projectId: task.projectId,
        status: "EM_DESENVOLVIMENTO",
      });
      setElapsed(0);
      toast.success("Cronômetro iniciado! Bom trabalho 🚀", { duration: 3000 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao iniciar cronômetro");
    }
  }, [user, activeSession, taskId, getTaskById, updateTaskStatus, startSession]);

  const stop = useCallback(
    async (description = "Trabalho realizado") => {
      if (!user) return;

      try {
        const result = await stopSession(description);
        if (!result) return;

        const { hours, elapsedSeconds, timeLog } = result;
        appendTimeLog(timeLog);
        setElapsed(0);

        const h = Math.floor(elapsedSeconds / 3600);
        const m = Math.floor((elapsedSeconds % 3600) / 60);
        const s = elapsedSeconds % 60;
        const label = h > 0 ? `${h}h ${m}min` : m > 0 ? `${m}min ${s}s` : `${s}s`;

        toast.success(`Trabalho finalizado! ${label} (${hours}h) registrado automaticamente.`, {
          duration: 5000,
        });
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Erro ao finalizar cronômetro");
      }
    },
    [user, stopSession, appendTimeLog]
  );

  const cancel = useCallback(async () => {
    try {
      await cancelSession();
      setElapsed(0);
      toast.info("Sessão cancelada. Tempo não registrado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cancelar sessão");
    }
  }, [cancelSession]);

  const displayedElapsed = isActive ? elapsed : 0;

  return {
    isActive,
    elapsed: displayedElapsed,
    elapsedFormatted: formatElapsed(displayedElapsed),
    hasOtherActiveSession: !!activeSession && activeSession.taskId !== taskId,
    activeSession,
    start,
    stop,
    cancel,
  };
}

/** Hook leve para verificar estado global (ex: header) */
export function useActiveWorkSession() {
  const { activeSession, getElapsedSeconds } = useWorkSessionStore();
  const [elapsed, setElapsed] = useState(getElapsedSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!activeSession) return;

    const initialTick = setTimeout(() => setElapsed(getElapsedSeconds()), 0);
    intervalRef.current = setInterval(() => setElapsed(getElapsedSeconds()), 1000);

    return () => {
      clearTimeout(initialTick);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSession, getElapsedSeconds]);

  const displayedElapsed = activeSession ? elapsed : 0;
  return { activeSession, elapsed: displayedElapsed, elapsedFormatted: formatElapsed(displayedElapsed) };
}

/** Sincroniza sessão ativa com o servidor (login, refresh, troca de aba) */
export function useSyncWorkSession(enabled: boolean) {
  const syncFromServer = useWorkSessionStore((s) => s.syncFromServer);

  useEffect(() => {
    if (!enabled) return;

    void syncFromServer();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        void syncFromServer();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [enabled, syncFromServer]);
}
