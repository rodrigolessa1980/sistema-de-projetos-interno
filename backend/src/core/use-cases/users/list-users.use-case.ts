import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';
import type { IUserPermissionRepository } from '../../domain/repositories/user-permission-repository.interface';
import { IUserPermissionRepositoryToken } from '../../domain/repositories/user-permission-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserPermission } from '../../domain/entities/user-permission.entity';

export interface UserWithPermissions {
  user: User;
  permissions: UserPermission[];
}

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(IUserPermissionRepositoryToken)
    private readonly permissionRepository: IUserPermissionRepository,
  ) {}

  async execute(): Promise<UserWithPermissions[]> {
    const users = await this.userRepository.listAll();
    // INC-08: uma query para todas as permissões (era 1 + N).
    const allPermissions = await this.permissionRepository.findByUserIds(users.map((u) => u.id));
    const byUser = new Map<string, UserPermission[]>();
    for (const permission of allPermissions) {
      const list = byUser.get(permission.userId);
      if (list) list.push(permission);
      else byUser.set(permission.userId, [permission]);
    }
    return users.map((user) => ({ user, permissions: byUser.get(user.id) ?? [] }));
  }
}
