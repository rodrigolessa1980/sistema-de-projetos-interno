"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTaskStore } from "@/stores";
import type { Task, TaskStatus, TimeLog } from "@/types";
import { toast } from "sonner";
import { api } from "@/lib/api";

export interface KanbanOrderPayload {
  taskId: string;
  targetStatus: TaskStatus;
  targetTaskIds: string[];
  sourceStatus?: TaskStatus;
  sourceTaskIds?: string[];
}

async function persistKanbanOrder(payload: KanbanOrderPayload) {
  await api.patch("tasks/kanban/order", payload);
}

export function useTasks(projectId?: string) {
  const store = useTaskStore();

  const tasksQuery = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      if (!projectId) {
        return store.tasks;
      }
      const tasks = await api.get<Task[]>(`tasks/project/${projectId}`);
      useTaskStore.setState({ tasks });
      return tasks;
    },
  });

  return { ...tasksQuery, tasks: tasksQuery.data ?? [] };
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const task = await api.get<Task>(`tasks/${taskId}`);
      useTaskStore.setState((state) => {
        const exists = state.tasks.some((item) => item.id === task.id);
        return {
          tasks: exists
            ? state.tasks.map((item) => (item.id === task.id ? task : item))
            : [...state.tasks, task],
        };
      });
      return task;
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
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: KanbanOrderPayload) => {
      store.applyKanbanOrder(payload);

      try {
        await persistKanbanOrder(payload);
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
