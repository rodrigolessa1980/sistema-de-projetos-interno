import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { emitTenantChange } from '../../sync/sync-events';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';

/**
 * INC-14: emite um evento de mudança (por tenant) após TODA requisição mutante
 * bem-sucedida (POST/PUT/PATCH/DELETE). Ponto único no boundary HTTP — NÃO toca a
 * extensão de isolamento (crítica). Os clientes do tenant recebem o sinal via SSE e
 * buscam o delta. Falhar aqui nunca deveria acontecer (só emite em caso de sucesso).
 */
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class SyncEmitInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!MUTATING_METHODS.has(req.method)) return next.handle();
    return next.handle().pipe(tap(() => emitTenantChange(req.tenantId)));
  }
}
