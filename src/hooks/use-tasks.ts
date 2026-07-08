"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTaskStore } from "@/stores";
import { normalizeTask } from "@/stores/task-store";
import type { TaskStatus, TimeLog } from "@/types";
import { toast } from "sonner";
import { api } from "@/lib/api";

/**
 * INC-06: a store Zustand é a ÚNICA fonte de verdade de tasks. Antes havia escrita
 * dupla (useQuery + setState na store) e `invalidateQueries(["tasks"])` nas mutações,
 * que causavam um refetch sobrescrevendo a atualização otimista (o "render errado
 * depois certo"). Agora:
 *   - `useTask` só faz fetch-into-store (hidrata a store; a página lê da store);
 *   - as mutações atualizam a store e NÃO invalidam queries — mudanças externas chegam
 *     pelo delta sync (useDeltaSync / INC-12).
 * (O antigo `useTasks`/`useCreateTask`/`useUpdateTask` foram removidos por não terem
 * consumidores — criação/edição usam `useTaskStore().createTask/updateTask` direto.)
 */

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

/** Carrega uma task pontual e hidrata a store (a tela de detalhe lê da store). */
export function useTask(taskId: string) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const task = await api.get<Parameters<typeof normalizeTask>[0]>(`tasks/${taskId}`);
      const normalized = normalizeTask(task);
      useTaskStore.setState((state) => {
        const exists = state.tasks.some((item) => item.id === normalized.id);
        return {
          tasks: exists
            ? state.tasks.map((item) => (item.id === normalized.id ? normalized : item))
            : [...state.tasks, normalized],
        };
      });
      return normalized;
    },
    enabled: !!taskId,
  });
}

export function useUpdateTaskStatus() {
  const store = useTaskStore();

  return useMutation({
    mutationFn: async ({ taskId, status, userId }: { taskId: string; status: TaskStatus; userId: string }) => {
      await store.updateTaskStatus(taskId, status, userId);
    },
    onSuccess: () => toast.success("Status atualizado com sucesso"),
    onError: (err) => toast.error(err instanceof Error ? err.message : "Erro ao atualizar status"),
  });
}

export function useUpdateKanbanOrder() {
  const store = useTaskStore();

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
  });
}

export function useLogTime() {
  const store = useTaskStore();

  return useMutation({
    mutationFn: async (data: Omit<TimeLog, "id" | "createdAt" | "userId">) => {
      return store.logTime(data);
    },
    onSuccess: () => toast.success("Tempo registrado com sucesso"),
    onError: () => toast.error("Erro ao registrar tempo"),
  });
}
