import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserPermissionRepository } from '../../../core/domain/repositories/user-permission-repository.interface';
import { UserPermission } from '../../../core/domain/entities/user-permission.entity';

@Injectable()
export class PrismaUserPermissionRepository implements IUserPermissionRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): UserPermission {
    return new UserPermission({
      id: raw.id,
      userId: raw.userId,
      module: raw.module,
      action: raw.action,
      granted: raw.granted,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findByUserId(userId: string): Promise<UserPermission[]> {
    const raws = await this.prisma.userPermission.findMany({ where: { userId } });
    return raws.map((r) => this.mapToDomain(r));
  }

  async findByUserIds(userIds: string[]): Promise<UserPermission[]> {
    if (userIds.length === 0) return [];
    const raws = await this.prisma.userPermission.findMany({ where: { userId: { in: userIds } } });
    return raws.map((r) => this.mapToDomain(r));
  }

  async upsertMany(
    userId: string,
    permissions: { module: string; action: string; granted: boolean }[],
  ): Promise<void> {
    await Promise.all(
      permissions.map((p) =>
        this.prisma.userPermission.upsert({
          where: { userId_module_action: { userId, module: p.module, action: p.action } },
          create: { userId, module: p.module, action: p.action, granted: p.granted },
          update: { granted: p.granted },
        }),
      ),
    );
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.userPermission.deleteMany({ where: { userId } });
  }
}
