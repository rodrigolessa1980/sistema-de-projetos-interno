import { Subject } from 'rxjs';

/**
 * Barramento de eventos de mudança por tenant (INC-14 / SSE).
 *
 * Singleton de módulo (sem DI) para poder ser emitido de um interceptor e consumido
 * pelo controller de SSE sem acoplar módulos. Cada escrita HTTP bem-sucedida emite o
 * tenantId; o stream de SSE filtra por tenant e "cutuca" os clientes daquele grupo,
 * que então buscam o delta (`/sync/changes?since=`). É só um SINAL — nenhum dado
 * sensível trafega pelo evento.
 */
export interface TenantChange {
  tenantId: string;
}

export const syncEvents = new Subject<TenantChange>();

export function emitTenantChange(tenantId: string | undefined | null): void {
  if (tenantId) syncEvents.next({ tenantId });
}
