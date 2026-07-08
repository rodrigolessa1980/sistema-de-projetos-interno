import { AsyncLocalStorage } from 'node:async_hooks';

interface TenantStore {
  tenantId: string;
}

const storage = new AsyncLocalStorage<TenantStore>();

/**
 * Contexto de tenant por request. É setado uma vez (pelo TenantContextInterceptor,
 * a partir do tenantId resolvido no JwtAuthGuard) e lido pela extensão do Prisma
 * para injetar o filtro `tenantId` automaticamente em toda query isolada.
 */
export const TenantContext = {
  run<T>(tenantId: string, fn: () => T): T {
    return storage.run({ tenantId }, fn);
  },
  getTenantId(): string | undefined {
    return storage.getStore()?.tenantId;
  },
};
