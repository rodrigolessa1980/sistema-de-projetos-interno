import { User } from '../../../core/domain/entities/user.entity';

export interface UserResponse {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  position: string;
  department: string;
  isActive: boolean;
  isApproved: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export class UserPresenter {
  static toHTTP(user: User): UserResponse {
    return {
      id: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      position: user.position,
      department: user.department,
      isActive: user.isActive,
      isApproved: user.isApproved,
      lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
