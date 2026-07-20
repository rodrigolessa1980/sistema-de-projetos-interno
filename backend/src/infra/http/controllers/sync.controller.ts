import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  mapEpic,
  mapModule,
  mapProject,
  mapTask,
  mapTimeLog,
  mapComment,
  mapSubtask,
  mapTaskNote,
  mapTaskDependency,
} from '../mappers/sync.mappers';

/**
 * Delta sync (INC-12). Retorna apenas o que mudou desde `since` (por `updatedAt`) para
 * o cliente aplicar via mergeById (respeitando itens com edição otimista em voo).
 *
 * Deletes: como não há tabela de change-log, o endpoint também devolve o conjunto de ids
 * atuais por entidade; o cliente remove localmente o que não estiver mais presente
 * (ver applyDelta no front). Custo baixo (só ids) e robusto para uma ferramenta interna.
 *
 * Tenant é aplicado automaticamente pela extensão (PrismaService estendido).
 */
@Controller('sync')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SyncController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('changes')
  @RequirePermission('projects:read')
  async changes(@Query('since') since?: string) {
    const s = since ? new Date(since) : new Date(0);
    const gt = { updatedAt: { gt: s } } as const;

    const [projects, tasks, timeLogs, modules, epics, comments, subtasks, notes, dependencies] =
      await Promise.all([
        this.prisma.project.findMany({ where: gt, include: { developers: { select: { userId: true } } } }),
        this.prisma.task.findMany({ where: gt }),
        this.prisma.timeLog.findMany({ where: gt }),
        this.prisma.module.findMany({ where: gt }),
        this.prisma.epic.findMany({ where: gt, include: { developers: { select: { userId: true } } } }),
        this.prisma.comment.findMany({ where: gt }),
        this.prisma.subtask.findMany({ where: gt }),
        this.prisma.taskNote.findMany({ where: gt }),
        // Dependência não tem updatedAt (imutável): filtra por createdAt.
        this.prisma.taskDependency.findMany({ where: { createdAt: { gt: s } } }),
      ]);

    // Ids atuais por entidade (leve) para o cliente podar deletes.
    const [
      projectIds,
      taskIds,
      timeLogIds,
      moduleIds,
      epicIds,
      commentIds,
      subtaskIds,
      noteIds,
      dependencyIds,
    ] = await Promise.all([
      this.prisma.project.findMany({ select: { id: true } }),
      this.prisma.task.findMany({ select: { id: true } }),
      this.prisma.timeLog.findMany({ select: { id: true } }),
      this.prisma.module.findMany({ select: { id: true } }),
      this.prisma.epic.findMany({ select: { id: true } }),
      this.prisma.comment.findMany({ select: { id: true } }),
      this.prisma.subtask.findMany({ select: { id: true } }),
      this.prisma.taskNote.findMany({ select: { id: true } }),
      this.prisma.taskDependency.findMany({ select: { id: true } }),
    ]);

    const ids = (rows: { id: string }[]) => rows.map((r) => r.id);

    return {
      now: new Date().toISOString(),
      changed: {
        projects: projects.map(mapProject),
        tasks: tasks.map(mapTask),
        timeLogs: timeLogs.map(mapTimeLog),
        modules: modules.map(mapModule),
        epics: epics.map(mapEpic),
        comments: comments.map(mapComment),
        subtasks: subtasks.map(mapSubtask),
        notes: notes.map(mapTaskNote),
        dependencies: dependencies.map(mapTaskDependency),
      },
      ids: {
        projects: ids(projectIds),
        tasks: ids(taskIds),
        timeLogs: ids(timeLogIds),
        modules: ids(moduleIds),
        epics: ids(epicIds),
        comments: ids(commentIds),
        subtasks: ids(subtaskIds),
        notes: ids(noteIds),
        dependencies: ids(dependencyIds),
      },
    };
  }
}
