import type { StateStorage } from "zustand/middleware";

/**
 * Storage para o `persist` do zustand com política de espaço.
 *
 * Contexto (bug de produção): o `persist` regrava o blob inteiro no localStorage a
 * cada `set()` da store. Em Safari/Mac a cota da origem é pequena (~5MB, pior em
 * HTTP/modo restrito) e o `setItem` lança `QuotaExceededError` — no Safari a
 * mensagem é literalmente "The quota has been exceeded.". Como a escrita acontece
 * dentro do `set()`, a exceção subia e derrubava mutações que já haviam tido
 * sucesso no servidor (ex.: criar módulo dispara um `setState` na task-store).
 *
 * Regras:
 * 1. `setItem` NUNCA lança — persistir é best-effort, não pode quebrar a UI.
 * 2. Quando falta espaço, a gente LIBERA o mínimo necessário: remove os caches
 *    recuperáveis (re-hidratados da API no próximo load), um a um, tentando
 *    regravar a cada remoção. Para assim que couber — "usar só o necessário".
 * 3. A sessão de login (`devflow-auth-v2`) é a última linha: só é sacrificada se
 *    for a própria chave que não cabe e não houver mais nada para liberar.
 */

/** Chave da sessão — perder isto desloga o usuário; evitamos ao máximo. */
const AUTH_KEY = "devflow-auth-v2";

/**
 * Ordem de descarte quando falta espaço (menos importante → mais importante).
 * Tudo aqui é recuperável: `users` vem do bootstrap/API; `ui` são só preferências
 * de sidebar; `tasks` guarda logs/notas locais. `auth` NÃO entra nesta lista.
 */
const EVICTION_ORDER = ["devflow-users-v3", "devflow-ui", "devflow-tasks"];

function rawSet(name: string, value: string): void {
  // Pode lançar QuotaExceededError — quem chama trata.
  globalThis.localStorage.setItem(name, value);
}

function rawRemove(name: string): void {
  try {
    globalThis.localStorage?.removeItem(name);
  } catch {
    /* ignora */
  }
}

export const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return globalThis.localStorage?.getItem(name) ?? null;
    } catch {
      // Safari em private mode / storage bloqueado por ITP pode lançar até no read.
      return null;
    }
  },

  setItem: (name, value) => {
    // Caminho feliz.
    try {
      rawSet(name, value);
      return;
    } catch (error) {
      if (!isQuotaError(error) || typeof globalThis.localStorage === "undefined") {
        console.warn(`[persist] não foi possível gravar "${name}"`, error);
        return;
      }
    }

    // Sem espaço: libera caches recuperáveis, um a um, e tenta regravar.
    // Não removemos a própria chave que estamos gravando (não adianta).
    for (const key of EVICTION_ORDER) {
      if (key === name) continue;
      rawRemove(key);
      try {
        rawSet(name, value);
        console.warn(`[persist] "${name}" gravado após liberar "${key}" (cota cheia)`);
        return;
      } catch {
        /* ainda cheio — continua liberando */
      }
    }

    // Última tentativa: derruba a sessão só se for indispensável para caber
    // a escrita atual (ex.: a própria escrita é grande demais mesmo sozinha).
    if (name !== AUTH_KEY) {
      rawRemove(AUTH_KEY);
      try {
        rawSet(name, value);
        return;
      } catch {
        /* desiste */
      }
    }

    console.warn(`[persist] "${name}" não coube no localStorage; seguindo só em memória`);
  },

  removeItem: (name) => rawRemove(name),
};

/** Detecta QuotaExceededError de forma cross-browser (código/nome variam). */
function isQuotaError(error: unknown): boolean {
  if (!(error instanceof DOMException)) return false;
  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" || // Firefox
    error.code === 22 ||
    error.code === 1014
  );
}
