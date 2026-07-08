import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../../core/domain/entities/enums';
import { BasePrismaService } from '../../database/prisma/prisma.service';
import type { AuthenticatedRequest } from './jwt-auth.guard';

/**
 * INC-14: auth do endpoint SSE. EventSource não envia header Authorization, então o
 * token JWT vem por query (`?token=`). Espelha a validação do JwtAuthGuard (verifyAsync
 * + token de dev) e checa usuário ativo/aprovado. Só JWT/dev-token (não API tokens).
 *
 * ⚠️ Trade-off: token na URL pode aparecer em logs/histórico. Aceitável para ferramenta
 * interna; revisar antes de expor publicamente.
 */
interface AuthPayload {
  sub: string;
  role: UserRole;
  tenantId?: string;
  exp?: number;
}

const FAKE_TOKEN_PREFIX = 'devflow_fake_jwt_';

@Injectable()
export class SseAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: BasePrismaService,
  ) {}

  private decodeDevelopmentToken(token: string): AuthPayload | null {
    if (process.env.NODE_ENV === 'production' || !token.startsWith(FAKE_TOKEN_PREFIX)) {
      return null;
    }
    try {
      const encoded = token.slice(FAKE_TOKEN_PREFIX.length);
      const payload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as AuthPayload;
      if (payload.exp && payload.exp < Date.now()) return null;
      return payload.sub && payload.role ? payload : null;
    } catch {
      return null;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = String((request.query as Record<string, unknown>)?.token ?? '');
    if (!token) throw new UnauthorizedException('Token de autenticação ausente.');

    let payload = this.decodeDevelopmentToken(token);
    if (!payload) {
      try {
        payload = await this.jwtService.verifyAsync<AuthPayload>(token);
      } catch {
        throw new UnauthorizedException('Token inválido ou expirado.');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true, isApproved: true, tenantId: true },
    });
    if (!user?.isActive || !user.isApproved) {
      throw new UnauthorizedException('Usuário inativo ou não aprovado.');
    }

    request.userId = user.id;
    request.tenantId = user.tenantId;
    request.userRole = user.role as UserRole;
    return true;
  }
}
