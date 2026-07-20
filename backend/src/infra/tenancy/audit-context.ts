import { AsyncLocalStorage } from 'node:async_hooks';
import { AuditAction } from '../../core/domain/entities/enums';

export interface AuditDetail {
  /** Sobrescreve a ação genérica derivada do método HTTP (ex.: STATUS_CHANGED). */
  action?: AuditAction;
  previousValue?: unknown;
  newValue?: unknown;
  /** Frase humana ("Alterou status de X para Y"). */
  description?: string;
}

interface AuditStore {
  detail: AuditDetail | null;
}

const storage = new AsyncLocalStorage<AuditStore>();

/**
 * Contexto de auditoria por request. Inicializado (vazio) pelo
 * TenantContextInterceptor e ENRIQUECIDO pelos use-cases que conhecem o
 * "antes/depois" (ex.: update-task sabe status/responsável antigos). O
 * AuditInterceptor lê o detalhe no fim da requisição e grava UMA entrada —
 * rica quando o use-case descreveu, genérica (método+rota) caso contrário.
 */
export const AuditContext = {
  run<T>(fn: () => T): T {
    return storage.run({ detail: null }, fn);
  },
  setDetail(detail: AuditDetail): void {
    const store = storage.getStore();
    if (store) store.detail = detail;
  },
  getDetail(): AuditDetail | null {
    return storage.getStore()?.detail ?? null;
  },
};
