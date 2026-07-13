import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireAdmin } from '../decorators/require-permission.decorator';
import { PrismaService } from '../../database/prisma/prisma.service';

/**
 * Lixeira (admin): enxerga, restaura e purga registros soft-deleted.
 *
 * A extensão de tenant esconde `deletedAt != null` de todo o app; aqui passamos
 * `deletedAt` EXPLÍCITO no where, o único jeito de alcançar os excluídos (a
 * extensão respeita o filtro explícito e mantém o isolamento por tenant).
 *
 * A listagem mostra só as "raízes" da exclusão — o item cujo PAI ainda está ativo
 * (ex.: um projeto excluído aparece 1x, não seus 200 descendentes). Restaurar usa
 * o timestamp exato do soft delete para trazer de volta só o conjunto que caiu junto.
 */
type TrashType =
  | 'project'
  | 'module'
  | 'task'
  | 'timelog'
  | 'company'
  | 'module-attachment'
  | 'showcase-attachment'
  | 'demand-attachment';

interface TrashItem {
  type: TrashType;
  id: string;
  label: string;
  deletedAt: string;
  context?: string;
}

const DELETED = { deletedAt: { not: null } } as const;
const ACTIVE = { deletedAt: null } as const;

@Controller('trash')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequireAdmin()
export class TrashController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(): Promise<{ items: TrashItem[] }> {
    const [projects, companies, modules, tasks, timelogs, moduleAtts, showcaseAtts, demandAtts] =
      await Promise.all([
        this.prisma.project.findMany({
          where: { ...DELETED },
          select: { id: true, name: true, deletedAt: true },
          orderBy: { deletedAt: 'desc' },
        }),
        this.prisma.company.findMany({
          where: { ...DELETED },
          select: { id: true, name: true, deletedAt: true },
          orderBy: { deletedAt: 'desc' },
        }),
        // Raiz = excluído mas com o projeto ainda ativo (senão é vítima da cascata do projeto).
        this.prisma.module.findMany({
          where: { ...DELETED, project: ACTIVE },
          select: { id: true, name: true, deletedAt: true, project: { select: { name: true } } },
          orderBy: { deletedAt: 'desc' },
        }),
        this.prisma.task.findMany({
          where: { ...DELETED, module: ACTIVE },
          select: { id: true, title: true, deletedAt: true, project: { select: { name: true } } },
          orderBy: { deletedAt: 'desc' },
        }),
        this.prisma.timeLog.findMany({
          where: { ...DELETED, task: ACTIVE },
          select: { id: true, description: true, hours: true, deletedAt: true, task: { select: { title: true } } },
          orderBy: { deletedAt: 'desc' },
        }),
        this.prisma.moduleAttachment.findMany({
          where: { ...DELETED, module: ACTIVE },
          select: { id: true, name: true, deletedAt: true, module: { select: { name: true } } },
          orderBy: { deletedAt: 'desc' },
        }),
        this.prisma.projectShowcaseAttachment.findMany({
          where: { ...DELETED, project: ACTIVE },
          select: { id: true, name: true, deletedAt: true, project: { select: { name: true } } },
          orderBy: { deletedAt: 'desc' },
        }),
        this.prisma.projectDemandAttachment.findMany({
          where: { ...DELETED, project: ACTIVE },
          select: { id: true, name: true, deletedAt: true, project: { select: { name: true } } },
          orderBy: { deletedAt: 'desc' },
        }),
      ]);

    const iso = (d: Date | null) => (d ? d.toISOString() : '');
    const items: TrashItem[] = [
      ...projects.map((p): TrashItem => ({ type: 'project', id: p.id, label: p.name, deletedAt: iso(p.deletedAt) })),
      ...companies.map((c): TrashItem => ({ type: 'company', id: c.id, label: c.name, deletedAt: iso(c.deletedAt) })),
      ...modules.map((m): TrashItem => ({ type: 'module', id: m.id, label: m.name, deletedAt: iso(m.deletedAt), context: m.project?.name })),
      ...tasks.map((t): TrashItem => ({ type: 'task', id: t.id, label: t.title, deletedAt: iso(t.deletedAt), context: t.project?.name })),
      ...timelogs.map((l): TrashItem => ({ type: 'timelog', id: l.id, label: `${Number(l.hours)}h — ${l.description || 'Registro de tempo'}`, deletedAt: iso(l.deletedAt), context: l.task?.title })),
      ...moduleAtts.map((a): TrashItem => ({ type: 'module-attachment', id: a.id, label: a.name, deletedAt: iso(a.deletedAt), context: a.module?.name })),
      ...showcaseAtts.map((a): TrashItem => ({ type: 'showcase-attachment', id: a.id, label: a.name, deletedAt: iso(a.deletedAt), context: a.project?.name })),
      ...demandAtts.map((a): TrashItem => ({ type: 'demand-attachment', id: a.id, label: a.name, deletedAt: iso(a.deletedAt), context: a.project?.name })),
    ];

    items.sort((a, b) => (a.deletedAt < b.deletedAt ? 1 : -1));
    return { items };
  }

  @Post(':type/:id/restore')
  async restore(@Param('type') type: string, @Param('id') id: string): Promise<{ success: boolean }> {
    switch (type as TrashType) {
      case 'project':
        await this.restoreProject(id);
        break;
      case 'module':
        await this.restoreModule(id);
        break;
      case 'task':
        await this.restoreTask(id);
        break;
      case 'timelog':
        await this.restoreSimple('timeLog', id);
        break;
      case 'company':
        await this.restoreSimple('company', id);
        break;
      case 'module-attachment':
        await this.restoreSimple('moduleAttachment', id);
        break;
      case 'showcase-attachment':
        await this.restoreSimple('projectShowcaseAttachment', id);
        break;
      case 'demand-attachment':
        await this.restoreSimple('projectDemandAttachment', id);
        break;
      default:
        throw new BadRequestException('Tipo inválido.');
    }
    return { success: true };
  }

  @Delete(':type/:id')
  async purge(@Param('type') type: string, @Param('id') id: string): Promise<{ success: boolean }> {
    // Hard delete definitivo. O onDelete: Cascade do banco limpa os descendentes.
    const model = this.modelFor(type);
    const deleted = await (this.prisma as any)[model].deleteMany({ where: { id, ...DELETED } });
    if (deleted.count === 0) throw new NotFoundException('Item não encontrado na lixeira.');
    return { success: true };
  }

  // --- restore helpers ---

  private async restoreSimple(model: string, id: string): Promise<void> {
    const updated = await (this.prisma as any)[model].updateMany({
      where: { id, ...DELETED },
      data: { deletedAt: null },
    });
    if (updated.count === 0) throw new NotFoundException('Item não encontrado na lixeira.');
  }

  private async restoreTask(id: string): Promise<void> {
    const task = await this.prisma.task.findFirst({ where: { id, ...DELETED }, select: { deletedAt: true } });
    if (!task?.deletedAt) throw new NotFoundException('Tarefa não encontrada na lixeira.');
    const ts = task.deletedAt;
    await this.prisma.$transaction([
      this.prisma.timeLog.updateMany({ where: { taskId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.task.updateMany({ where: { id, ...DELETED }, data: { deletedAt: null } }),
    ]);
  }

  private async restoreModule(id: string): Promise<void> {
    const module = await this.prisma.module.findFirst({ where: { id, ...DELETED }, select: { deletedAt: true } });
    if (!module?.deletedAt) throw new NotFoundException('Módulo não encontrado na lixeira.');
    const ts = module.deletedAt;
    const tasks = await this.prisma.task.findMany({ where: { moduleId: id, deletedAt: ts }, select: { id: true } });
    const taskIds = tasks.map((t) => t.id);
    await this.prisma.$transaction([
      ...(taskIds.length
        ? [this.prisma.timeLog.updateMany({ where: { taskId: { in: taskIds }, deletedAt: ts }, data: { deletedAt: null } })]
        : []),
      this.prisma.moduleAttachment.updateMany({ where: { moduleId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.task.updateMany({ where: { moduleId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.epic.updateMany({ where: { moduleId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.module.updateMany({ where: { id, ...DELETED }, data: { deletedAt: null } }),
    ]);
  }

  private async restoreProject(id: string): Promise<void> {
    const project = await this.prisma.project.findFirst({ where: { id, ...DELETED }, select: { deletedAt: true } });
    if (!project?.deletedAt) throw new NotFoundException('Projeto não encontrado na lixeira.');
    const ts = project.deletedAt;
    await this.prisma.$transaction([
      this.prisma.timeLog.updateMany({ where: { projectId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.moduleAttachment.updateMany({ where: { module: { projectId: id }, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.projectShowcaseAttachment.updateMany({ where: { projectId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.projectDemandAttachment.updateMany({ where: { projectId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.task.updateMany({ where: { projectId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.epic.updateMany({ where: { projectId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.module.updateMany({ where: { projectId: id, deletedAt: ts }, data: { deletedAt: null } }),
      this.prisma.project.updateMany({ where: { id, ...DELETED }, data: { deletedAt: null } }),
    ]);
  }

  private modelFor(type: string): string {
    const map: Record<TrashType, string> = {
      project: 'project',
      module: 'module',
      task: 'task',
      timelog: 'timeLog',
      company: 'company',
      'module-attachment': 'moduleAttachment',
      'showcase-attachment': 'projectShowcaseAttachment',
      'demand-attachment': 'projectDemandAttachment',
    };
    const model = map[type as TrashType];
    if (!model) throw new BadRequestException('Tipo inválido.');
    return model;
  }
}
