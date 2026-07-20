import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';

/**
 * Consulta do audit log (admin). Isolado por tenant automaticamente pela extensão
 * do Prisma (client estendido). Somente leitura — os registros são escritos pelo
 * AuditInterceptor.
 */
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @RequirePermission('users:read')
  async list(@Query('limit') limit?: string, @Query('entityId') entityId?: string) {
    const take = Math.min(Math.max(Number(limit) || 100, 1), 500);
    const logs = await this.prisma.auditLog.findMany({
      where: entityId ? { entityId } : undefined,
      orderBy: { createdAt: 'desc' },
      take,
      include: { user: { select: { name: true } } },
    });

    return logs.map((log) => ({
      id: log.id,
      entityType: log.entityType,
      entityId: log.entityId,
      action: log.action,
      userId: log.userId,
      userName: log.user?.name ?? null,
      description: log.description,
      previousValue: log.previousValue ?? null,
      newValue: log.newValue ?? null,
      createdAt: log.createdAt.toISOString(),
    }));
  }
}
