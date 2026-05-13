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
  const { logTime, updateTaskStatus, getTaskById } = useTaskStore();

  const [elapsed, setElapsed] = useState(getElapsedSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isActive = isWorking(taskId);

  // Tick em tempo real enquanto a sessão estiver ativa para ESTE task
  useEffect(() => {
    if (isActive) {
      // Sincroniza com o valor real ao montar (ex: volta de outra página)
      setElapsed(getElapsedSeconds());
      intervalRef.current = setInterval(() => {
        setElapsed(getElapsedSeconds());
      }, 1000);
    } else {
      setElapsed(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, getElapsedSeconds]);

  const start = useCallback(async () => {
    if (!user) return;

    // Bloqueia se houtra sessão em andamento em outra task
    if (activeSession && activeSession.taskId !== taskId) {
      toast.error("Finalize o trabalho na task atual antes de iniciar outra.");
      return;
    }

    const task = getTaskById(taskId);
    if (!task) return;

    // Muda status automaticamente para EM_DESENVOLVIMENTO
    if (task.status !== "EM_DESENVOLVIMENTO") {
      await updateTaskStatus(taskId, "EM_DESENVOLVIMENTO", user.id);
    }

    startSession(taskId, user.id);
    toast.success("Cronômetro iniciado! Bom trabalho 🚀", { duration: 3000 });
  }, [user, activeSession, taskId, getTaskById, updateTaskStatus, startSession]);

  const stop = useCallback(
    async (description = "Trabalho realizado") => {
      if (!user) return;

      const result = stopSession(description);
      if (!result) return;

      const { hours, elapsedSeconds } = result;

      // Registra automaticamente o tempo no time log
      await logTime({
        taskId,
        userId: user.id,
        hours,
        description,
        date: new Date().toISOString().split("T")[0],
        status: "EM_DESENVOLVIMENTO",
      });

      const h = Math.floor(elapsedSeconds / 3600);
      const m = Math.floor((elapsedSeconds % 3600) / 60);
      const s = elapsedSeconds % 60;
      const label = h > 0 ? `${h}h ${m}min` : m > 0 ? `${m}min ${s}s` : `${s}s`;

      toast.success(`Trabalho finalizado! ${label} registrado automaticamente.`, {
        duration: 5000,
      });
    },
    [user, stopSession, logTime, taskId]
  );

  const cancel = useCallback(() => {
    cancelSession();
    toast.info("Sessão cancelada. Tempo não registrado.");
  }, [cancelSession]);

  return {
    isActive,
    elapsed,
    elapsedFormatted: formatElapsed(elapsed),
    /** Se há alguma sessão ativa em outra task */
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
    if (activeSession) {
      setElapsed(getElapsedSeconds());
      intervalRef.current = setInterval(() => setElapsed(getElapsedSeconds()), 1000);
    } else {
      setElapsed(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSession, getElapsedSeconds]);

  return { activeSession, elapsed, elapsedFormatted: formatElapsed(elapsed) };
}
