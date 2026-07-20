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

  /**
   * Delta desde `since`. Duas variantes:
   *  - ROTINA (padrão): só o NÚCLEO (projeto/tarefa/timelog/módulo/épico) —
   *    entidades que cascateiam ou não são push-SSE. 10 queries.
   *  - CATCH-UP (`?full=1`): inclui também as FOLHAS (comment/subtask/note/dep),
   *    usado ao (re)conectar o SSE e na rede de segurança — cura o que o push
   *    possa ter perdido. No dia a dia as folhas chegam por push (0 query aqui).
   */
  @Get('changes')
  @RequirePermission('projects:read')
  async changes(@Query('since') since?: string, @Query('full') full?: string) {
    const s = since ? new Date(since) : new Date(0);
    const gt = { updatedAt: { gt: s } } as const;
    const isFull = full === '1' || full === 'true';
    const ids = (rows: { id: string }[]) => rows.map((r) => r.id);

    const [projects, tasks, timeLogs, modules, epics] = await Promise.all([
      this.prisma.project.findMany({ where: gt, include: { developers: { select: { userId: true } } } }),
      this.prisma.task.findMany({ where: gt }),
      this.prisma.timeLog.findMany({ where: gt }),
      this.prisma.module.findMany({ where: gt }),
      this.prisma.epic.findMany({ where: gt, include: { developers: { select: { userId: true } } } }),
    ]);
    const [projectIds, taskIds, timeLogIds, moduleIds, epicIds] = await Promise.all([
      this.prisma.project.findMany({ select: { id: true } }),
      this.prisma.task.findMany({ select: { id: true } }),
      this.prisma.timeLog.findMany({ select: { id: true } }),
      this.prisma.module.findMany({ select: { id: true } }),
      this.prisma.epic.findMany({ select: { id: true } }),
    ]);

    const changed: Record<string, unknown> = {
      projects: projects.map(mapProject),
      tasks: tasks.map(mapTask),
      timeLogs: timeLogs.map(mapTimeLog),
      modules: modules.map(mapModule),
      epics: epics.map(mapEpic),
    };
    const idsOut: Record<string, string[]> = {
      projects: ids(projectIds),
      tasks: ids(taskIds),
      timeLogs: ids(timeLogIds),
      modules: ids(moduleIds),
      epics: ids(epicIds),
    };

    if (isFull) {
      const [comments, subtasks, notes, dependencies] = await Promise.all([
        this.prisma.comment.findMany({ where: gt }),
        this.prisma.subtask.findMany({ where: gt }),
        this.prisma.taskNote.findMany({ where: gt }),
        // Dependência não tem updatedAt (imutável): filtra por createdAt.
        this.prisma.taskDependency.findMany({ where: { createdAt: { gt: s } } }),
      ]);
      // Folhas hard-delete precisam de id-list p/ poda; comentário é soft e NÃO
      // some (mostra "apagado") — vem só no `changed`, sem id-list.
      const [subtaskIds, noteIds, dependencyIds] = await Promise.all([
        this.prisma.subtask.findMany({ select: { id: true } }),
        this.prisma.taskNote.findMany({ select: { id: true } }),
        this.prisma.taskDependency.findMany({ select: { id: true } }),
      ]);
      changed.comments = comments.map(mapComment);
      changed.subtasks = subtasks.map(mapSubtask);
      changed.notes = notes.map(mapTaskNote);
      changed.dependencies = dependencies.map(mapTaskDependency);
      idsOut.subtasks = ids(subtaskIds);
      idsOut.notes = ids(noteIds);
      idsOut.dependencies = ids(dependencyIds);
    }

    return { now: new Date().toISOString(), changed, ids: idsOut };
  }
}
