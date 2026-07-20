import { Subject } from 'rxjs';

/**
 * Barramento de eventos de mudança por tenant (SSE). Singleton de módulo (sem DI)
 * para emitir de um interceptor e consumir no controller de SSE sem acoplar módulos.
 *
 * Dois tipos de sinal:
 *  - GENÉRICO (`emitTenantChange`): "algo mudou no grupo" → o cliente busca o
 *    delta coalescido (`/sync/changes`). Usado quando a mudança cascateia
 *    (ex.: status de tarefa altera módulo/projeto derivados) ou não é "folha".
 *  - PUSH DE ENTIDADE (`emitEntityChange`): carrega o próprio dado de uma
 *    entidade "folha" da thread (comentário/subtarefa/anotação/dependência) que
 *    NÃO cascateia. O cliente aplica direto na memória — ZERO query no recebimento.
 */
export type SyncLeafEntity = 'comment' | 'subtask' | 'note' | 'dependency';

export interface SyncEntityChange {
  op: 'upsert' | 'delete';
  entity: SyncLeafEntity;
  id: string;
  data?: unknown;
}

export interface TenantSignal {
  tenantId: string;
  change?: SyncEntityChange;
}

export const syncEvents = new Subject<TenantSignal>();

/** Sinal genérico: "busque o delta". */
export function emitTenantChange(tenantId: string | undefined | null): void {
  if (tenantId) syncEvents.next({ tenantId });
}

/** Push do dado de uma entidade folha: o cliente aplica sem buscar. */
export function emitEntityChange(
  tenantId: string | undefined | null,
  change: SyncEntityChange,
): void {
  if (tenantId) syncEvents.next({ tenantId, change });
}
