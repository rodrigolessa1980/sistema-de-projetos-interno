"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTaskStore } from "@/stores";
import { delay } from "@/lib/utils";
import type { Task, TaskStatus, TimeLog } from "@/types";
import { toast } from "sonner";

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
