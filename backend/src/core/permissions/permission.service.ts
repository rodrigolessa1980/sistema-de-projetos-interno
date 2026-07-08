import { Injectable } from '@nestjs/common';
import { UserRole } from '../domain/entities/enums';
import {
  ALL_PERMISSIONS,
  DEFAULT_DEVELOPER_PERMISSIONS,
  type PermissionKey,
} from './permission-keys';
import { BasePrismaService } from '../../infra/database/prisma/prisma.service';

@Injectable()
export class PermissionService {
  // Roda em tempo de guard (antes do contexto de tenant): usa o client base.
  // Permissões são lidas por userId, portanto não dependem de filtro por tenant.
  constructor(private readonly prisma: BasePrismaService) {}

  async getUserPermissionSet(userId: string, role: UserRole): Promise<Set<PermissionKey>> {
    if (role === UserRole.ADMIN) {
      return new Set(ALL_PERMISSIONS);
    }

    const stored = await this.prisma.userPermission.findMany({
      where: { userId, granted: true },
      select: { module: true, action: true },
    });

    if (stored.length === 0) {
      return new Set(DEFAULT_DEVELOPER_PERMISSIONS);
    }

    const permissions = new Set<PermissionKey>();
    for (const entry of stored) {
      const key = `${entry.module}:${entry.action}` as PermissionKey;
      permissions.add(key);
    }
    return permissions;
  }

  resolveTokenScopes(
    userPermissions: Set<PermissionKey>,
    tokenScopes: string[] | null | undefined,
  ): Set<PermissionKey> {
    if (!tokenScopes || tokenScopes.length === 0) {
      return new Set(userPermissions);
    }

    const allowed = new Set<PermissionKey>();
    for (const scope of tokenScopes) {
      const key = scope as PermissionKey;
      if (userPermissions.has(key)) {
        allowed.add(key);
      }
    }
    return allowed;
  }

  hasPermission(
    role: UserRole,
    permissions: Set<PermissionKey>,
    required: PermissionKey,
  ): boolean {
    if (role === UserRole.ADMIN) return true;
    return permissions.has(required);
  }

  validateScopesSubset(
    userPermissions: Set<PermissionKey>,
    requestedScopes: string[],
  ): PermissionKey[] {
    const invalid = requestedScopes.filter(
      (scope) => !userPermissions.has(scope as PermissionKey),
    );
    if (invalid.length > 0) {
      throw new Error(
        `Escopos não permitidos para este usuário: ${invalid.join(', ')}`,
      );
    }
    return requestedScopes as PermissionKey[];
  }
}
