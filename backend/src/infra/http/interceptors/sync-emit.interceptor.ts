import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import {
  emitTenantChange,
  emitEntityChange,
  SyncEntityChange,
  SyncLeafEntity,
} from '../../sync/sync-events';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';

/**
 * Após TODA requisição mutante bem-sucedida (POST/PUT/PATCH/DELETE) emite um
 * sinal por tenant que alimenta o SSE.
 *
 * Quando a mutação é de uma entidade "folha" da thread (comentário/subtarefa/
 * anotação/dependência) — que NÃO cascateia para módulo/projeto — empurra o
 * PRÓPRIO DADO (o cliente aplica sem buscar). Nos demais casos (tarefa cascateia
 * derivação, projeto/módulo, etc.) emite o sinal genérico e o cliente busca o
 * delta coalescido. Falhar aqui nunca acontece (só emite em sucesso).
 */
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function leafEntityFromPath(path: string): SyncLeafEntity | null {
  if (path.includes('/comments')) return 'comment';
  if (path.includes('/subtasks')) return 'subtask';
  if (path.includes('/notes')) return 'note';
  if (path.includes('/dependencies')) return 'dependency';
  return null;
}

function buildLeafChange(req: AuthenticatedRequest, body: unknown): SyncEntityChange | null {
  const path = (req.url ?? '').split('?')[0];
  const entity = leafEntityFromPath(path);
  if (!entity) return null;

  const bodyId =
    body && typeof body === 'object'
      ? ((body as Record<string, unknown>).id as string | undefined)
      : undefined;

  // Resposta traz a entidade (id) → upsert com o dado (inclui DELETE de comentário,
  // que é soft e retorna o comentário marcado "apagado").
  if (bodyId) return { op: 'upsert', entity, id: bodyId, data: body };

  // DELETE hard (subtarefa/anotação/dependência) responde { success } → remoção.
  if (req.method === 'DELETE') {
    const id = path.split('/').filter(Boolean).pop();
    if (id) return { op: 'delete', entity, id };
  }
  return null;
}

@Injectable()
export class SyncEmitInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!MUTATING_METHODS.has(req.method)) return next.handle();
    return next.handle().pipe(
      tap((body) => {
        const change = buildLeafChange(req, body);
        if (change) emitEntityChange(req.tenantId, change);
        else emitTenantChange(req.tenantId);
      }),
    );
  }
}
