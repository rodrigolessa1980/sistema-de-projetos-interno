import { Injectable } from '@nestjs/common';
import { AuditContext, AuditDetail } from '../../infra/tenancy/audit-context';

/**
 * Ponte para os use-cases enriquecerem o audit log da requisição corrente com
 * o "antes/depois" que só eles conhecem. O registro em si é gravado pelo
 * AuditInterceptor no fim da request (ator/tenant vêm do próprio request),
 * então aqui só descrevemos o detalhe — sem escrita duplicada.
 */
@Injectable()
export class AuditService {
  describe(detail: AuditDetail): void {
    AuditContext.setDetail(detail);
  }
}
