import { Inject, Injectable } from '@nestjs/common';
import type { IUserPermissionRepository } from '../../domain/repositories/user-permission-repository.interface';
import { IUserPermissionRepositoryToken } from '../../domain/repositories/user-permission-repository.interface';

export interface PermissionEntry {
  module: string;
  action: string;
  granted: boolean;
}

@Injectable()
export class UpdateUserPermissionsUseCase {
  constructor(
    @Inject(IUserPermissionRepositoryToken)
    private readonly permissionRepository: IUserPermissionRepository,
  ) {}

  async execute(userId: string, permissions: PermissionEntry[]): Promise<void> {
    await this.permissionRepository.upsertMany(userId, permissions);
  }
}
