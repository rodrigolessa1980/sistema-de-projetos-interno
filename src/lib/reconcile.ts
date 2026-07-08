/**
 * Reconciliação de estado servidor vs. local (INC-03 do plano de sincronização).
 *
 * Contrato único de merge para acabar com o ciclo "render otimista/errado -> render
 * correto do servidor" e evitar que um poll/refetch lento sobrescreva uma edição local
 * ainda em voo. Regra: last-write-wins por `updatedAt`, respeitando itens "sujos"
 * (com mutação otimista pendente de confirmação).
 *
 * Ver docs/plano-execucao-incremental.md (INC-03).
 */

export type Versioned = { id: string; updatedAt?: string | null };

/**
 * `true` = o registro do servidor deve substituir o local.
 * - Sem local -> aceita o servidor.
 * - Local sujo (mutação em voo) -> NUNCA sobrescreve (protege a edição do usuário).
 * - Sem timestamp em algum lado -> aceita o servidor (não há como comparar).
 * - Caso geral -> aceita se o servidor for igual/mais novo.
 */
export function serverWins(
  local: Versioned | undefined,
  server: Versioned,
  dirtyIds?: ReadonlySet<string>,
): boolean {
  if (!local) return true;
  if (dirtyIds?.has(server.id)) return false;
  if (!local.updatedAt || !server.updatedAt) return true;
  return new Date(server.updatedAt).getTime() >= new Date(local.updatedAt).getTime();
}

/**
 * Faz o merge de uma lista vinda do servidor sobre a lista local, preservando itens
 * sujos e itens locais que o servidor não trouxe (ex.: outros projetos num delta parcial).
 * Mantém a ordem: itens atuais primeiro (na ordem original), novos do servidor ao final.
 */
export function mergeById<T extends Versioned>(
  current: T[],
  incoming: T[],
  dirtyIds?: ReadonlySet<string>,
): T[] {
  const byId = new Map<string, T>();
  for (const item of current) byId.set(item.id, item);

  const seen = new Set<string>();
  for (const server of incoming) {
    seen.add(server.id);
    if (serverWins(byId.get(server.id), server, dirtyIds)) {
      byId.set(server.id, server);
    }
  }

  // Reconstrói preservando ordem: existentes (possivelmente atualizados) + novos.
  const result: T[] = [];
  for (const item of current) result.push(byId.get(item.id) ?? item);
  for (const server of incoming) {
    if (!current.some((c) => c.id === server.id) && byId.has(server.id)) {
      result.push(byId.get(server.id)!);
    }
    void seen;
  }
  return result;
}

/**
 * Aplica um delta a uma lista: faz merge das mudanças (por versão/dirty) e remove os
 * itens que não estão mais no conjunto de ids atuais do servidor (deletes), preservando
 * SEMPRE os itens sujos (criados/editados otimisticamente e ainda não confirmados). INC-12.
 */
export function mergeAndPrune<T extends Versioned>(
  current: T[],
  changed: T[],
  currentServerIds: ReadonlySet<string>,
  dirtyIds?: ReadonlySet<string>,
): T[] {
  const merged = mergeById(current, changed, dirtyIds);
  return merged.filter((item) => currentServerIds.has(item.id) || dirtyIds?.has(item.id));
}

/**
 * Substitui um único registro na lista aplicando a regra de versão. Útil em respostas
 * de mutação: só troca se o servidor for mais novo e o item não estiver sujo por OUTRA
 * edição. Se não existir, adiciona ao final.
 */
export function upsertById<T extends Versioned>(
  current: T[],
  server: T,
  dirtyIds?: ReadonlySet<string>,
): T[] {
  const idx = current.findIndex((c) => c.id === server.id);
  if (idx === -1) return [...current, server];
  if (!serverWins(current[idx], server, dirtyIds)) return current;
  const next = current.slice();
  next[idx] = server;
  return next;
}

/**
 * Replace de dataset completo (o servidor é a fonte de verdade), preservando itens com
 * mutação otimista em voo (dirty): mantém a versão local dos dirty e reanexa dirty que o
 * servidor ainda não reflete (ex.: criado otimisticamente). Use em cargas full
 * (bootstrap / fetch total) — para deltas parciais use `mergeById`.
 */
export function replacePreservingDirty<T extends Versioned>(
  current: T[],
  incoming: T[],
  dirtyIds: ReadonlySet<string>,
): T[] {
  const incomingIds = new Set(incoming.map((t) => t.id));
  const merged = incoming.map((server) => {
    const local = current.find((t) => t.id === server.id);
    return local && dirtyIds.has(server.id) ? local : server;
  });
  for (const item of current) {
    if (dirtyIds.has(item.id) && !incomingIds.has(item.id)) merged.push(item);
  }
  return merged;
}

/**
 * Pequeno gerenciador de ids "sujos" (mutações otimistas em voo). Fica FORA do estado
 * persistido/reativo — é só um Set compartilhado por store. Use `markDirty` ao iniciar a
 * mutação e `clearDirty` no finally.
 */
export function createDirtyTracker() {
  const ids = new Set<string>();
  return {
    ids: ids as ReadonlySet<string>,
    markDirty: (id: string) => ids.add(id),
    clearDirty: (id: string) => ids.delete(id),
    isDirty: (id: string) => ids.has(id),
  };
}
