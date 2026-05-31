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
    const result: UserWithPermissions[] = [];
    for (const user of users) {
      const permissions = await this.permissionRepository.findByUserId(user.id);
      result.push({ user, permissions });
    }
    return result;
  }
}
