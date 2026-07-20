"use client";

import { useEffect, useRef } from "react";
import { api, API_URL, getSessionToken } from "@/lib/api";
import { mergeAndPrune, mergeById } from "@/lib/reconcile";
import {
  useProjectStore,
  projectDirty,
  normalizeProject,
  normalizeEpic,
} from "@/stores/project-store";
import { useTaskStore, taskDirty, normalizeTask } from "@/stores/task-store";
import { useUIStore } from "@/stores/ui-store";
import type { Project, Module, Epic, TimeLog, Comment, Subtask, TaskNote, TaskDependency } from "@/types";

/**
 * Rede de SEGURANÇA: sync periódico RARO, só para curar um evento SSE perdido
 * (queda de conexão/proxy). O tempo real vem do SSE, não deste intervalo — por
 * isso é longo (não é o "poll" que hammereia o banco).
 */
const SAFETY_POLL_MS = 120_000;
/**
 * Debounce dos sinais SSE: várias mutações em rajada (ex.: reordenar kanban, um
 * import) colapsam numa ÚNICA busca de delta, em vez de uma por evento.
 */
const SSE_DEBOUNCE_MS = 350;
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
  // Comentário é soft-delete e NÃO some (mostra "apagado") → só merge, sem poda.
  if (d.changed.comments) {
    patch.comments = mergeById(useTaskStore.getState().comments, d.changed.comments);
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

interface SyncEntityChange {
  op: "upsert" | "delete";
  entity: "comment" | "subtask" | "note" | "dependency";
  id: string;
  data?: unknown;
}

function upsertArr<T extends { id: string }>(arr: T[], item: T): T[] {
  const i = arr.findIndex((x) => x.id === item.id);
  if (i === -1) return [...arr, item];
  const next = arr.slice();
  next[i] = item;
  return next;
}

/**
 * Aplica um push de entidade "folha" (comentário/subtarefa/anotação/dependência)
 * direto na memória — sem NENHUMA busca. É o "opa, mudei → entra a nova": troca
 * só o item, o resto fica intacto. Entidades que cascateiam (tarefa→módulo→
 * projeto) NÃO vêm por aqui; usam o delta coalescido.
 */
function applyEntityChange(change: SyncEntityChange) {
  if (change.op === "upsert" && !change.data) return;
  useTaskStore.setState((state) => {
    switch (change.entity) {
      case "comment":
        return {
          comments:
            change.op === "delete"
              ? state.comments.filter((c) => c.id !== change.id)
              : upsertArr(state.comments, change.data as Comment),
        };
      case "subtask":
        return {
          subtasks:
            change.op === "delete"
              ? state.subtasks.filter((s) => s.id !== change.id)
              : upsertArr(state.subtasks, change.data as Subtask),
        };
      case "note":
        return {
          notes:
            change.op === "delete"
              ? state.notes.filter((n) => n.id !== change.id)
              : upsertArr(state.notes, change.data as TaskNote),
        };
      case "dependency":
        return {
          dependencies:
            change.op === "delete"
              ? state.dependencies.filter((d) => d.id !== change.id)
              : upsertArr(state.dependencies, change.data as TaskDependency),
        };
      default:
        return {};
    }
  });
}

/**
 * Sincronização em tempo real, elegante e pontual:
 *
 *  - O SSE (`/sync/stream`) é o "opa, algo mudou" — sinal em MEMÓRIA por tenant,
 *    sem custo de banco. NÃO trafega dado nem segura conexão de banco.
 *  - Ao receber o sinal, o cliente busca o delta de forma COALESCIDA (debounce)
 *    e SINGLE-FLIGHT: uma rajada de mutações vira UMA busca, e nunca há duas
 *    buscas sobrepostas. `applyDelta` troca item a item na memória (mergeById),
 *    então só o que mudou entra/sai — o resto fica intacto.
 *  - NÃO há poll constante. Só uma rede de segurança longa (SAFETY_POLL_MS) para
 *    curar um evento SSE eventualmente perdido, e uma busca ao (re)focar a aba.
 *
 * Efeito: as queries ao banco compartilhado acontecem só quando ALGO REALMENTE
 * mudou — uma vez por rajada, por cliente — em vez de a cada mutação × todos +
 * poll de 20s. Se o SSE cair, a rede de segurança + o foco cobrem a lacuna.
 */
export function useDeltaSync(enabled: boolean) {
  const since = useRef<string>(new Date(Date.now() - SEED_BACKFILL_MS).toISOString());

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let inFlight = false;
    let pending = false; // chegou sinal enquanto uma busca já rodava
    let debounce: ReturnType<typeof setTimeout> | null = null;

    // `full` = catch-up completo (inclui as folhas comment/subtask/note/dep);
    // usado ao (re)conectar/focar/segurança. Rotina (sinal SSE) é enxuta — as
    // folhas chegam por push, então o sync de rotina só traz o núcleo.
    async function fetchDelta(full = false) {
      if (cancelled || document.visibilityState !== "visible") return;
      // Single-flight: se já há uma busca em voo, marca que precisa repetir e sai.
      if (inFlight) {
        pending = true;
        return;
      }
      inFlight = true;
      try {
        const d = await api.get<SyncDelta>("sync/changes", {
          params: { since: since.current, ...(full ? { full: "1" } : {}) },
        });
        if (!cancelled) {
          applyDelta(d);
          since.current = d.now;
        }
      } catch {
        // silencioso: falha de rede não derruba o loop; a próxima rodada tenta de novo.
      } finally {
        inFlight = false;
        // Houve sinal durante a busca? Roda mais uma vez para pegar o que faltou.
        if (pending && !cancelled) {
          pending = false;
          schedule(0);
        }
      }
    }

    // Agenda uma busca coalescida (junta sinais próximos numa só).
    function schedule(delay = SSE_DEBOUNCE_MS, full = false) {
      if (cancelled) return;
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => void fetchDelta(full), delay);
    }

    // Catch-up inicial COMPLETO + rede de segurança longa (também completa: cura
    // qualquer folha perdida por push).
    schedule(0, true);
    const safety = setInterval(() => void fetchDelta(true), SAFETY_POLL_MS);

    function onVisible() {
      if (document.visibilityState === "visible") schedule(0, true);
    }
    document.addEventListener("visibilitychange", onVisible);

    // SSE: cada sinal "changed" agenda uma busca coalescida. Se o SSE cair, a
    // rede de segurança e o foco cobrem — puramente aditivo.
    let es: EventSource | null = null;
    const token = getSessionToken();
    if (token && typeof EventSource !== "undefined") {
      try {
        es = new EventSource(`${API_URL}/sync/stream?token=${encodeURIComponent(token)}`);
        // Ao (re)conectar: catch-up COMPLETO — cura folhas perdidas enquanto o
        // SSE esteve fora do ar.
        es.onopen = () => schedule(0, true);
        es.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data) as { type?: string; change?: SyncEntityChange };
            if (payload?.type === "entity" && payload.change) {
              // Push direto: aplica na memória, ZERO query.
              applyEntityChange(payload.change);
            } else if (payload?.type === "changed") {
              // Sinal genérico (tarefa/módulo/projeto/cascata): busca coalescida.
              schedule();
            }
          } catch {
            // heartbeat/parse — ignora
          }
        };
        // onerror: o EventSource reconecta sozinho; ao reconectar, a rede de
        // segurança/foco já busca o delta acumulado. Sem ação necessária.
      } catch {
        es = null;
      }
    }

    return () => {
      cancelled = true;
      if (debounce) clearTimeout(debounce);
      clearInterval(safety);
      document.removeEventListener("visibilitychange", onVisible);
      es?.close();
    };
  }, [enabled]);
}
