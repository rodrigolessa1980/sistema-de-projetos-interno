import { Inject, Injectable } from '@nestjs/common';
import type { IUserPermissionRepository } from '../../domain/repositories/user-permission-repository.interface';
import { IUserPermissionRepositoryToken } from '../../domain/repositories/user-permission-repository.interface';
import { UserPermission } from '../../domain/entities/user-permission.entity';

@Injectable()
export class GetUserPermissionsUseCase {
  constructor(
    @Inject(IUserPermissionRepositoryToken)
    private readonly permissionRepository: IUserPermissionRepository,
  ) {}

  async execute(userId: string): Promise<UserPermission[]> {
    return this.permissionRepository.findByUserId(userId);
  }
}
