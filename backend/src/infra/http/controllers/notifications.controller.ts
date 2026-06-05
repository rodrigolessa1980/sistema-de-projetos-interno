import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { JwtAuthGuard, type AuthenticatedRequest } from '../guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
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

  @Patch(':id/read')
  async markRead(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.prisma.notification.updateMany({
      where: { id, userId: req.userId },
      data: { read: true },
    });
    return { success: true };
  }

  @Patch('read-all')
  async markAllRead(@Req() req: AuthenticatedRequest) {
    await this.prisma.notification.updateMany({
      where: { userId: req.userId, read: false },
      data: { read: true },
    });
    return { success: true };
  }
}
