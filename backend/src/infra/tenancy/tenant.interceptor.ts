import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContext } from './tenant-context';
import { AuditContext } from './audit-context';
import type { AuthenticatedRequest } from '../http/guards/jwt-auth.guard';

/**
 * Interceptor global. Roda DEPOIS dos guards (que resolvem `request.tenantId`) e
 * executa todo o handler (controller -> use-case -> repository) dentro do
 * AsyncLocalStorage do tenant, de modo que a extensão do Prisma enxergue o
 * tenant durante toda a cadeia assíncrona.
 *
 * Rotas públicas (login/register/health) não têm `tenantId` e passam direto —
 * elas usam o client base, sem isolamento.
 */
@Injectable()
export class TenantContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context
      .switchToHttp()
      .getRequest<Partial<AuthenticatedRequest>>();
    const tenantId = request?.tenantId;

    if (!tenantId) {
      return next.handle();
    }

    return new Observable((subscriber) => {
      TenantContext.run(tenantId, () => {
        // Inicializa o contexto de auditoria (vazio) — use-cases enriquecem e o
        // AuditInterceptor lê no fim, dentro deste mesmo escopo assíncrono.
        AuditContext.run(() => {
          next.handle().subscribe(subscriber);
        });
      });
    });
  }
}
