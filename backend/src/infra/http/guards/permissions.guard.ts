import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { PermissionKey } from '../../../core/permissions/permission-keys';
import { PermissionService } from '../../../core/permissions/permission.service';
import {
  PERMISSION_KEY,
  REQUIRE_ADMIN_KEY,
} from '../decorators/require-permission.decorator';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { UserRole } from '../../../core/domain/entities/enums';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const requiredPermission = this.reflector.getAllAndOverride<PermissionKey | undefined>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requireAdmin = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_ADMIN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requireAdmin && request.userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Acesso restrito a administradores.');
    }

    if (!requiredPermission) {
      return true;
    }

    if (
      this.permissionService.hasPermission(
        request.userRole as UserRole,
        request.permissions,
        requiredPermission,
      )
    ) {
      return true;
    }

    throw new ForbiddenException(`Permissão necessária: ${requiredPermission}`);
  }
}
