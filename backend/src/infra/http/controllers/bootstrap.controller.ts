import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { PrismaService } from '../../database/prisma/prisma.service';
import { mapEpic, mapModule, mapProject, mapTask } from '../mappers/sync.mappers';

/**
 * Endpoint agregado de bootstrap (INC-01).
 *
 * Substitui a cascata de `6N+5` requests do login (1 projects + 1 companies + 5N por
 * projeto para modules/epics/attachments + N para tasks) por UMA chamada com poucas
 * queries em paralelo. O isolamento por tenant é aplicado automaticamente pela extensão
 * do Prisma (client estendido injetado como PrismaService).
 *
 * NÃO retorna anexos (dataUrl/base64) — eles são pesados e carregados sob demanda ao
 * abrir o detalhe (INC-02). As formas de saída (mappers) espelham os endpoints existentes
 * para que os normalizadores do front funcionem sem alteração.
 */
@Controller('bootstrap')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BootstrapController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @RequirePermission('projects:read')
  async load() {
    const [projects, companies, modules, epics, tasks] = await Promise.all([
      this.prisma.project.findMany({ include: { developers: { select: { userId: true } } } }),
      this.prisma.company.findMany(),
      this.prisma.module.findMany({ orderBy: { order: 'asc' } }),
      this.prisma.epic.findMany({ include: { developers: { select: { userId: true } } } }),
      this.prisma.task.findMany(),
    ]);

    return {
      projects: projects.map(mapProject),
      companies,
      modules: modules.map(mapModule),
      epics: epics.map(mapEpic),
      tasks: tasks.map(mapTask),
    };
  }
}
