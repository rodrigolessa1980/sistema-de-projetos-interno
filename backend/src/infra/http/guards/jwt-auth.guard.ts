import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole } from '../../../core/domain/entities/enums';
import type { IApiTokenRepository } from '../../../core/domain/repositories/api-token-repository.interface';
import { IApiTokenRepositoryToken } from '../../../core/domain/repositories/api-token-repository.interface';
import type { PermissionKey } from '../../../core/permissions/permission-keys';
import { PermissionService } from '../../../core/permissions/permission.service';
import {
  hashApiToken,
  isApiToken,
} from '../../../core/permissions/api-token.util';
import { PrismaService } from '../../database/prisma/prisma.service';

export interface AuthenticatedRequest extends Request {
  userId: string;
  userRole: UserRole;
  authMethod: 'jwt' | 'api_token';
  permissions: Set<PermissionKey>;
  apiTokenId?: string;
}

interface AuthPayload {
  sub: string;
  role: UserRole;
  exp?: number;
}

const FAKE_TOKEN_PREFIX = 'devflow_fake_jwt_';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly permissionService: PermissionService,
    @Inject(IApiTokenRepositoryToken)
    private readonly apiTokenRepository: IApiTokenRepository,
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

  private async authenticateApiToken(
    request: AuthenticatedRequest,
    token: string,
  ): Promise<boolean> {
    const tokenHash = hashApiToken(token);
    const apiToken = await this.apiTokenRepository.findByHash(tokenHash);
    if (!apiToken || !apiToken.isActive()) {
      throw new UnauthorizedException('Token de API inválido, expirado ou revogado.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: apiToken.userId },
      select: { id: true, role: true, isActive: true },
    });
    if (!user?.isActive) {
      throw new UnauthorizedException('Usuário associado ao token está inativo.');
    }

    const userPermissions = await this.permissionService.getUserPermissionSet(
      user.id,
      user.role as UserRole,
    );
    const effectivePermissions = this.permissionService.resolveTokenScopes(
      userPermissions,
      apiToken.scopes,
    );

    request.userId = user.id;
    request.userRole = user.role as UserRole;
    request.authMethod = 'api_token';
    request.permissions = effectivePermissions;
    request.apiTokenId = apiToken.id;

    void this.apiTokenRepository.markUsed(apiToken.id).catch(() => undefined);
    return true;
  }

  private async authenticateJwt(
    request: AuthenticatedRequest,
    payload: AuthPayload,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });
    if (!user?.isActive) {
      throw new UnauthorizedException('Usuário inativo.');
    }

    const role = user.role as UserRole;
    const permissions = await this.permissionService.getUserPermissionSet(user.id, role);

    request.userId = user.id;
    request.userRole = role;
    request.authMethod = 'jwt';
    request.permissions = permissions;
    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação ausente.');
    }

    const token = authHeader.slice(7);

    if (isApiToken(token)) {
      return this.authenticateApiToken(request, token);
    }

    const developmentPayload = this.decodeDevelopmentToken(token);
    if (developmentPayload) {
      return this.authenticateJwt(request, developmentPayload);
    }

    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(token);
      return this.authenticateJwt(request, payload);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
