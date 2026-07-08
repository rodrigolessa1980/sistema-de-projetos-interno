import { UserPermission } from '../entities/user-permission.entity';

export const IUserPermissionRepositoryToken = 'IUserPermissionRepository';

export interface IUserPermissionRepository {
  findByUserId(userId: string): Promise<UserPermission[]>;
  /** Busca as permissões de vários usuários numa query só (evita N+1). */
  findByUserIds(userIds: string[]): Promise<UserPermission[]>;
  upsertMany(userId: string, permissions: { module: string; action: string; granted: boolean }[]): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
}
