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
 * Modelos com soft delete (coluna `deletedAt`). Em leituras/updates/deletes a
 * extensão injeta `where.deletedAt = null`, então registros excluídos ficam
 * invisíveis em TODO o domínio automaticamente — inclusive no /sync/changes
 * (o snapshot de ids não os inclui, e o cliente os poda). A exclusão em si é um
 * update que grava `data.deletedAt`; como o alvo ainda tem `deletedAt = null`,
 * o filtro no `where` não impede a operação.
 *
 * ESCAPE HATCH: se o `where` da chamada já traz `deletedAt` explícito, a extensão
 * NÃO sobrescreve. É assim que a Lixeira (admin) enxerga/restaura/purga excluídos:
 * passando `where: { deletedAt: { not: null } }` a leitura/restore alcança os
 * registros ocultos (continuando isolada por tenant).
 */
const SOFT_DELETE_MODELS = new Set<string>([
  'Project',
  'Company',
  'Module',
  'Epic',
  'Task',
  'TimeLog',
  'TaskAttachment',
  'ModuleAttachment',
  'ProjectShowcaseAttachment',
  'ProjectDemandAttachment',
  'User',
]);

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
            // Esconde registros soft-deleted de toda leitura/escrita por id,
            // A MENOS que a chamada já filtre `deletedAt` de propósito (Lixeira).
            if (
              SOFT_DELETE_MODELS.has(model) &&
              !('deletedAt' in (a.where as Record<string, unknown>))
            ) {
              a.where = { ...(a.where as object), deletedAt: null };
            }
        }

        return query(a);
      },
    },
  },
});
