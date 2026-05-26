"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTaskStore } from "@/stores";
import { useAuthStore } from "@/stores/auth-store";
import { delay } from "@/lib/utils";
import type { Task, TaskStatus, TimeLog } from "@/types";
import { toast } from "sonner";

export interface KanbanOrderPayload {
  taskId: string;
  targetStatus: TaskStatus;
  targetTaskIds: string[];
  sourceStatus?: TaskStatus;
  sourceTaskIds?: string[];
}

async function persistKanbanOrder(payload: KanbanOrderPayload, token?: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${apiUrl}/tasks/kanban/order`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(body?.message ?? "Backend não confirmou a nova ordem");
    }
  } finally {
    window.clearTimeout(timeout);
  }
}

export function useTasks(projectId?: string) {
  const store = useTaskStore();

  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      await delay(300);
      return projectId ? store.getTasksByProject(projectId) : store.tasks;
    },
  });

  return { ...tasksQuery, tasks: tasksQuery.data ?? [] };
}

export function useTask(taskId: string) {
  const store = useTaskStore();

  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      await delay(200);
      return store.getTaskById(taskId) ?? null;
    },
    enabled: !!taskId,
  });
}

export function useUpdateTaskStatus() {
  const store = useTaskStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status, userId }: { taskId: string; status: TaskStatus; userId: string }) => {
      await store.updateTaskStatus(taskId, status, userId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Status atualizado com sucesso");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar status");
    },
  });
}

export function useUpdateKanbanOrder() {
  const store = useTaskStore();
  const token = useAuthStore((state) => state.session?.token);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: KanbanOrderPayload) => {
      store.applyKanbanOrder(payload);

      try {
        await persistKanbanOrder(payload, token);
        return { persisted: true };
      } catch (error) {
        return {
          persisted: false,
          message: error instanceof Error ? error.message : "Backend indisponível",
        };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useLogTime() {
  const store = useTaskStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<TimeLog, "id" | "createdAt">) => {
      return store.logTime(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tempo registrado com sucesso");
    },
    onError: () => toast.error("Erro ao registrar tempo"),
  });
}

export function useCreateTask() {
  const store = useTaskStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
      return store.createTask(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task criada com sucesso");
    },
    onError: () => toast.error("Erro ao criar task"),
  });
}

export function useUpdateTask() {
  const store = useTaskStore();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      return store.updateTask(id, data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task atualizada com sucesso");
    },
    onError: () => toast.error("Erro ao atualizar task"),
  });
}
