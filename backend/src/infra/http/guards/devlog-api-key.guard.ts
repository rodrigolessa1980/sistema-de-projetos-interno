import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class DevlogApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const expected = process.env.DEVLOG_API_KEY;
    if (!expected) {
      throw new UnauthorizedException(
        'DEVLOG_API_KEY não configurada no servidor.',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.header('x-devlog-key');
    if (!provided || provided !== expected) {
      throw new UnauthorizedException('Chave de importação inválida.');
    }

    return true;
  }
}
