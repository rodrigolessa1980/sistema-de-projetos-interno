import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId: string;
  userRole: string;
}

interface AuthPayload {
  sub: string;
  role: string;
  exp?: number;
}

const FAKE_TOKEN_PREFIX = 'devflow_fake_jwt_';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação ausente.');
    }

    const token = authHeader.slice(7);
    const developmentPayload = this.decodeDevelopmentToken(token);
    if (developmentPayload) {
      request.userId = developmentPayload.sub;
      request.userRole = developmentPayload.role;
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync<AuthPayload>(token);

      request.userId = payload.sub;
      request.userRole = payload.role;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
