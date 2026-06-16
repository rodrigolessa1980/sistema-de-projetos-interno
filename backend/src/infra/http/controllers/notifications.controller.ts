import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { JwtAuthGuard, type AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @RequirePermission('tasks:read')
  async listMine(@Req() req: AuthenticatedRequest) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return notifications.map((notification) => ({
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      relatedTaskId: notification.relatedTaskId,
      relatedProjectId: notification.relatedProjectId,
      createdAt: notification.createdAt.toISOString(),
    }));
  }

  @Patch('read-all')
  @RequirePermission('tasks:read')
  async markAllRead(@Req() req: AuthenticatedRequest) {
    await this.prisma.notification.updateMany({
      where: { userId: req.userId, read: false },
      data: { read: true },
    });
    return { success: true };
  }

  @Patch(':id/read')
  @RequirePermission('tasks:read')
  async markRead(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.prisma.notification.updateMany({
      where: { id, userId: req.userId },
      data: { read: true },
    });
    return { success: true };
  }
}
