"use client";

import { useEffect, useRef } from "react";
import { api, API_URL, getSessionToken } from "@/lib/api";
import { mergeAndPrune } from "@/lib/reconcile";
import {
  useProjectStore,
  projectDirty,
  normalizeProject,
  normalizeEpic,
} from "@/stores/project-store";
import { useTaskStore, taskDirty, normalizeTask } from "@/stores/task-store";
import { useUIStore } from "@/stores/ui-store";
import type { Project, Module, Epic, TimeLog, Comment, Subtask, TaskNote, TaskDependency } from "@/types";

/** Intervalo do poll com a aba em foco. */
const POLL_MS = 20_000;
/** Buffer ao semear `since` p/ cobrir a janela entre o bootstrap e este hook montar. */
const SEED_BACKFILL_MS = 5 * 60_000;

interface SyncDelta {
  now: string;
  changed: {
    projects: Project[];
    tasks: Parameters<typeof normalizeTask>[0][];
    timeLogs: TimeLog[];
    modules: Module[];
    epics: Epic[];
    comments?: Comment[];
    subtasks?: Subtask[];
    notes?: TaskNote[];
    dependencies?: TaskDependency[];
  };
  ids: {
    projects: string[];
    tasks: string[];
    timeLogs: string[];
    modules: string[];
    epics: string[];
    comments?: string[];
    subtasks?: string[];
    notes?: string[];
    dependencies?: string[];
  };
}

/** Aplica o delta às stores: merge por versão (respeitando dirty) + prune de deletes. */
function applyDelta(d: SyncDelta) {
  const projectIds = new Set(d.ids.projects);
  const moduleIds = new Set(d.ids.modules);
  const epicIds = new Set(d.ids.epics);
  useProjectStore.setState((state) => ({
    projects: mergeAndPrune(state.projects, d.changed.projects.map(normalizeProject), projectIds, projectDirty.ids),
    modules: mergeAndPrune(state.modules, d.changed.modules, moduleIds),
    epics: mergeAndPrune(state.epics, d.changed.epics.map(normalizeEpic), epicIds),
  }));

  const taskIds = new Set(d.ids.tasks);
  const timeLogIds = new Set(d.ids.timeLogs);
  // Coleções de tarefa: só aplica se o backend as enviou (compatível com versões
  // antigas do endpoint). Anexos ficam de fora (base64 pesado, sob demanda).
  const patch: Record<string, unknown> = {
    tasks: mergeAndPrune(useTaskStore.getState().tasks, d.changed.tasks.map(normalizeTask), taskIds, taskDirty.ids),
    timeLogs: mergeAndPrune(
      useTaskStore.getState().timeLogs,
      d.changed.timeLogs.map((tl) => ({ ...tl, date: tl.date ? tl.date.split("T")[0] : tl.date })),
      timeLogIds,
    ),
  };
  if (d.changed.comments && d.ids.comments) {
    patch.comments = mergeAndPrune(useTaskStore.getState().comments, d.changed.comments, new Set(d.ids.comments));
  }
  if (d.changed.subtasks && d.ids.subtasks) {
    patch.subtasks = mergeAndPrune(useTaskStore.getState().subtasks, d.changed.subtasks, new Set(d.ids.subtasks));
  }
  if (d.changed.notes && d.ids.notes) {
    patch.notes = mergeAndPrune(useTaskStore.getState().notes, d.changed.notes, new Set(d.ids.notes));
  }
  if (d.changed.dependencies && d.ids.dependencies) {
    patch.dependencies = mergeAndPrune(useTaskStore.getState().dependencies, d.changed.dependencies, new Set(d.ids.dependencies));
  }
  useTaskStore.setState(patch as never);

  // Notificações são por-usuário (não vêm no delta do tenant): rebusca as minhas
  // a cada sinal de mudança, para o sino refletir atribuições/conclusões ao vivo.
  void useUIStore.getState().fetchNotifications().catch(() => {});
}

/**
 * Delta sync (INC-12): busca `GET /sync/changes?since=` a cada POLL_MS com a aba em foco,
 * e imediatamente ao voltar o foco. Assim o usuário vê mudanças de outros usuários sem
 * recarregar, e sem re-baixar datasets inteiros. Evolui para SSE no INC-14 (o push só
 * troca o "quando buscar"; o applyDelta continua igual).
 */
export function useDeltaSync(enabled: boolean) {
  const since = useRef<string>(new Date(Date.now() - SEED_BACKFILL_MS).toISOString());

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function schedule() {
      if (cancelled) return;
      timer = setTimeout(() => void tick(), POLL_MS);
    }

    async function tick() {
      if (cancelled) return;
      if (document.visibilityState !== "visible") {
        schedule();
        return;
      }
      try {
        const d = await api.get<SyncDelta>("sync/changes", { params: { since: since.current } });
        if (!cancelled) {
          applyDelta(d);
          since.current = d.now;
        }
      } catch {
        // silencioso: uma falha de rede não deve derrubar o loop; tenta no próximo tick.
      }
      schedule();
    }

    function onVisible() {
      if (document.visibilityState === "visible") void tick();
    }

    schedule();
    document.addEventListener("visibilitychange", onVisible);

    // INC-14: SSE — push quase instantâneo. Ao receber "changed", busca o delta na hora.
    // Puramente aditivo: se o SSE falhar (auth/rede), o polling acima cobre tudo.
    let es: EventSource | null = null;
    const token = getSessionToken();
    if (token && typeof EventSource !== "undefined") {
      try {
        es = new EventSource(`${API_URL}/sync/stream?token=${encodeURIComponent(token)}`);
        es.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data) as { type?: string };
            if (payload?.type === "changed") void tick();
          } catch {
            // heartbeat/parse — ignora
          }
        };
        es.onerror = () => {
          // silencioso: mantém o polling como fallback
        };
      } catch {
        es = null;
      }
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      es?.close();
    };
  }, [enabled]);
}
