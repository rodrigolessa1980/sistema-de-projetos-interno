import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { BasePrismaService } from '../../database/prisma/prisma.service';
import { AuditAction, AuditEntityType } from '../../../core/domain/entities/enums';
import { AuditContext } from '../../tenancy/audit-context';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';

/**
 * Audit log global: registra TODA requisição mutante bem-sucedida
 * (POST/PUT/PATCH/DELETE) sobre as entidades de domínio, com ator, tenant e
 * entidade afetada. Ponto único no boundary HTTP — "controle mínimo organizado"
 * sem instrumentar cada use-case.
 *
 * Usa o client BASE e grava `tenantId`/`userId` explícitos (do request), então
 * não depende do AsyncLocalStorage estar ativo no `tap` pós-resposta.
 * Best-effort: uma falha aqui é logada e nunca afeta a resposta ao usuário.
 */
const ACTION_BY_METHOD: Record<string, AuditAction> = {
  POST: AuditAction.CREATED,
  PUT: AuditAction.UPDATED,
  PATCH: AuditAction.UPDATED,
  DELETE: AuditAction.DELETED,
};

const ENTITY_BY_SEGMENT: Record<string, AuditEntityType> = {
  tasks: AuditEntityType.TASK,
  projects: AuditEntityType.PROJECT,
  modules: AuditEntityType.MODULE,
  epics: AuditEntityType.EPIC,
  users: AuditEntityType.USER,
};

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: BasePrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const action = ACTION_BY_METHOD[req.method];
    if (!action) return next.handle();
    return next.handle().pipe(tap((body) => void this.record(req, action, body)));
  }

  private async record(
    req: AuthenticatedRequest,
    action: AuditAction,
    body: unknown,
  ): Promise<void> {
    // Lê o detalhe rico ANTES de qualquer await (enquanto o ALS ainda está ativo).
    const detail = AuditContext.getDetail();
    try {
      const userId = req.userId;
      const tenantId = req.tenantId;
      if (!userId || !tenantId) return; // rota pública (login/health): não audita

      const path = (req.url ?? '').split('?')[0];
      const segment = path
        .split('/')
        .filter(Boolean)
        .find((p) => p in ENTITY_BY_SEGMENT);
      if (!segment) return; // rota não mapeada (sync, reports, bootstrap…)

      const bodyId =
        body && typeof body === 'object'
          ? ((body as Record<string, unknown>).id as string | undefined)
          : undefined;
      const entityId = String(req.params?.id ?? bodyId ?? '');

      await this.prisma.auditLog.create({
        data: {
          tenantId,
          userId,
          entityType: ENTITY_BY_SEGMENT[segment],
          entityId,
          // Ação/descrição/antes-depois vêm do use-case quando ele enriqueceu
          // (ex.: STATUS_CHANGED); senão, o genérico por método HTTP.
          action: detail?.action ?? action,
          description: detail?.description ?? `${req.method} ${path}`,
          previousValue: (detail?.previousValue ?? undefined) as never,
          newValue: (detail?.newValue ?? undefined) as never,
        },
      });
    } catch (error) {
      console.error('[AuditInterceptor] falha ao registrar auditoria:', error);
    }
  }
}
