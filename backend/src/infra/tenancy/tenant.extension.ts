import { Prisma } from '../../generated/prisma/client';
import { TenantContext } from './tenant-context';

/**
 * Modelos SEM coluna `tenantId` — não devem ser filtrados pela extensão.
 * Qualquer modelo novo que não pertença a um tenant precisa ser listado aqui;
 * caso contrário a extensão tentará injetar `tenantId` e o Prisma lançará erro
 * (falha fechada, proposital).
 */
const UNSCOPED_MODELS = new Set<string>(['Tenant']);

/**
 * Extensão de isolamento multi-tenant.
 *
 * - Leituras / agregações / update/delete em massa e por id -> injeta `where.tenantId`.
 * - create / createMany                                       -> injeta `data.tenantId`.
 * - upsert                                                    -> injeta em `where` e `create`.
 *
 * Se não houver contexto de tenant, LANÇA erro (protege contra query global
 * acidental). Fluxos legítimos sem tenant (login, guard, seed/scripts) usam o
 * client base, que NÃO tem esta extensão.
 */
export const tenantExtension = Prisma.defineExtension({
  name: 'tenant-isolation',
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (UNSCOPED_MODELS.has(model)) {
          return query(args);
        }

        const tenantId = TenantContext.getTenantId();
        if (!tenantId) {
          throw new Error(
            `Contexto de tenant ausente em ${model}.${operation}. Toda operação ` +
              'isolada precisa rodar dentro de TenantContext.run() (via client base ' +
              'para fluxos de autenticação/scripts).',
          );
        }

        const a = (args ?? {}) as Record<string, unknown>;

        switch (operation) {
          case 'create':
            a.data = { ...(a.data as object), tenantId };
            break;
          case 'createMany':
            a.data = Array.isArray(a.data)
              ? a.data.map((d) => ({ ...(d as object), tenantId }))
              : { ...(a.data as object), tenantId };
            break;
          case 'upsert':
            a.where = { ...(a.where as object), tenantId };
            a.create = { ...(a.create as object), tenantId };
            break;
          default:
            // find*, count, aggregate, groupBy, update, updateMany, delete, deleteMany
            a.where = { ...(a.where as object), tenantId };
        }

        return query(a);
      },
    },
  },
});
