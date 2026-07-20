import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ITaskRepository,
  KanbanOrderUpdate,
} from '../../../core/domain/repositories/task-repository.interface';
import { Task } from '../../../core/domain/entities/task.entity';
import { TaskStatus } from '../../../core/domain/entities/enums';
import {
  MODULE_PROGRESS,
  deriveModuleStatus,
  deriveProjectProgress,
} from '../../../core/domain/services/derive-hierarchy';

/** Subconjunto do client usado pela sincronização — aceita `this.prisma` ou o `tx` de uma transação. */
type HierarchyClient = Pick<PrismaService, 'module' | 'task' | 'project'>;

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Reforça a invariante da hierarquia `Projeto ⊃ Módulo ⊃ Tarefa` após uma
   * escrita de tarefa: recalcula o status/progresso dos módulos afetados e, em
   * cascata, o progresso dos projetos a que pertencem (regra canônica em
   * `derive-hierarchy`). Recebe o `tx` da transação da escrita, então tarefa e
   * hierarquia derivada são gravadas atomicamente — um erro aqui reverte a
   * escrita inteira, em vez de deixar módulo/projeto defasados.
   *
   * `Task.moduleId` é NOT NULL (toda tarefa pertence a um módulo); o único id
   * possivelmente ausente aqui vem de um lookup opcional do registro anterior
   * (findUnique), daí o filtro de `undefined`.
   */
  private async syncHierarchy(
    tx: HierarchyClient,
    moduleIds: Array<string | undefined>,
  ): Promise<void> {
    const ids = [...new Set(moduleIds.filter((id): id is string => id !== undefined))];
    if (ids.length === 0) return;

    const touched = await tx.module.findMany({
      where: { id: { in: ids } },
      select: { projectId: true },
    });
    const projectIds = [...new Set(touched.map((m) => m.projectId))];

    // Recalcula projeto a projeto: com todos os módulos e tarefas do projeto em
    // mãos, deriva cada módulo e o progresso ponderado do projeto de uma vez.
    for (const projectId of projectIds) {
      const modules = await tx.module.findMany({
        where: { projectId },
        select: { id: true, status: true, progress: true },
      });
      const tasks = await tx.task.findMany({
        where: { moduleId: { in: modules.map((m) => m.id) } },
        select: { moduleId: true, status: true },
      });

      const statusesByModule = new Map<string, TaskStatus[]>();
      for (const t of tasks) {
        const arr = statusesByModule.get(t.moduleId);
        if (arr) arr.push(t.status as TaskStatus);
        else statusesByModule.set(t.moduleId, [t.status as TaskStatus]);
      }

      const weights: Array<{ progress: number; taskCount: number }> = [];
      for (const m of modules) {
        const statuses = statusesByModule.get(m.id) ?? [];
        const derived = deriveModuleStatus(statuses);
        const progress = derived === null ? m.progress : MODULE_PROGRESS[derived];
        if (derived !== null && (derived !== m.status || progress !== m.progress)) {
          await tx.module.update({
            where: { id: m.id },
            data: { status: derived, progress },
          });
        }
        weights.push({ progress, taskCount: statuses.length });
      }

      await tx.project.update({
        where: { id: projectId },
        data: { progress: deriveProjectProgress(weights) },
      });
    }
  }

  private mapToDomain(raw: any): Task {
    return new Task({
      id: raw.id,
      projectId: raw.projectId,
      moduleId: raw.moduleId,
      epicId: raw.epicId,
      parentTaskId: raw.parentTaskId,
      title: raw.title,
      description: raw.description,
      status: raw.status as TaskStatus,
      complexity: raw.complexity,
      assigneeId: raw.assigneeId,
      reporterId: raw.reporterId,
      estimatedHours: raw.estimatedHours,
      actualHours: Number(raw.actualHours),
      startDate: raw.startDate,
      dueDate: raw.dueDate,
      completedAt: raw.completedAt,
      blockedReason: raw.blockedReason,
      isUrgent: raw.isUrgent,
      urgentBlockedById: raw.urgentBlockedById,
      urgentPreviousStatus: raw.urgentPreviousStatus as TaskStatus | null,
      order: raw.order,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findById(id: string): Promise<Task | null> {
    const raw = await this.prisma.task.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async create(task: Task): Promise<Task> {
    const raw = await this.prisma.$transaction(async (tx) => {
      const created = await tx.task.create({
        data: {
          id: task.id || undefined,
          projectId: task.projectId,
          moduleId: task.moduleId,
          epicId: task.epicId,
          parentTaskId: task.parentTaskId,
          title: task.title,
          description: task.description,
          status: task.status,
          complexity: task.complexity,
          assigneeId: task.assigneeId,
          reporterId: task.reporterId,
          estimatedHours: task.estimatedHours,
          actualHours: task.actualHours,
          startDate: task.startDate,
          dueDate: task.dueDate,
          completedAt: task.completedAt,
          blockedReason: task.blockedReason,
          isUrgent: task.isUrgent,
          urgentBlockedById: task.urgentBlockedById,
          urgentPreviousStatus: task.urgentPreviousStatus,
          order: task.order,
        },
      });
      await this.syncHierarchy(tx, [created.moduleId]);
      return created;
    });
    return this.mapToDomain(raw);
  }

  async update(task: Task): Promise<Task> {
    const raw = await this.prisma.$transaction(async (tx) => {
      // moduleId anterior: se a tarefa mudou de módulo, ambos precisam recalcular.
      const previous = await tx.task.findUnique({
        where: { id: task.id },
        select: { moduleId: true, status: true },
      });
      const updated = await tx.task.update({
        where: { id: task.id },
        data: {
          projectId: task.projectId,
          moduleId: task.moduleId,
          epicId: task.epicId,
          parentTaskId: task.parentTaskId,
          title: task.title,
          description: task.description,
          status: task.status,
          complexity: task.complexity,
          assigneeId: task.assigneeId,
          reporterId: task.reporterId,
          estimatedHours: task.estimatedHours,
          actualHours: task.actualHours,
          startDate: task.startDate,
          dueDate: task.dueDate,
          completedAt: task.completedAt,
          blockedReason: task.blockedReason,
          isUrgent: task.isUrgent,
          urgentBlockedById: task.urgentBlockedById,
          urgentPreviousStatus: task.urgentPreviousStatus,
          order: task.order,
        },
      });
      // PERF: a derivação módulo/projeto só depende de STATUS e MÓDULO. Editar
      // título, prazo, horas, responsável, etc. NÃO muda a hierarquia — então só
      // recalcula quando um desses dois mudou (antes recomputava o projeto
      // inteiro a cada escrita, o gargalo "porco").
      const affectsHierarchy =
        previous?.status !== updated.status || previous?.moduleId !== updated.moduleId;
      if (affectsHierarchy) {
        await this.syncHierarchy(tx, [previous?.moduleId, updated.moduleId]);
      }
      return updated;
    });
    return this.mapToDomain(raw);
  }

  async bulkUpdate(tasks: Task[]): Promise<void> {
    if (tasks.length === 0) return;
    // Uma transação com N updates = 1 round-trip em vez de N awaits sequenciais.
    // Cada update passa pela extensão de tenant (tenantId injetado no where). INC-08.
    await this.prisma.$transaction(
      tasks.map((task) =>
        this.prisma.task.update({
          where: { id: task.id },
          data: {
            projectId: task.projectId,
            moduleId: task.moduleId,
            epicId: task.epicId,
            parentTaskId: task.parentTaskId,
            title: task.title,
            description: task.description,
            status: task.status,
            complexity: task.complexity,
            assigneeId: task.assigneeId,
            reporterId: task.reporterId,
            estimatedHours: task.estimatedHours,
            actualHours: task.actualHours,
            startDate: task.startDate,
            dueDate: task.dueDate,
            completedAt: task.completedAt,
            blockedReason: task.blockedReason,
            isUrgent: task.isUrgent,
            urgentBlockedById: task.urgentBlockedById,
            urgentPreviousStatus: task.urgentPreviousStatus,
            order: task.order,
          },
        }),
      ),
      { timeout: 60_000 },
    );
  }

  async delete(id: string): Promise<void> {
    // Soft delete: marca deletedAt na tarefa e nos time logs dela (mesmo timestamp,
    // p/ restaurar o conjunto). A extensão filtra `deletedAt: null` em todas as
    // leituras, então tarefa e horas somem das listas/kanban/relatórios e, via
    // snapshot de ids do /sync/changes, são podadas nos demais clientes.
    const now = new Date();
    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.task.findUnique({
        where: { id },
        select: { moduleId: true },
      });
      await tx.timeLog.updateMany({ where: { taskId: id }, data: { deletedAt: now } });
      await tx.task.update({ where: { id }, data: { deletedAt: now } });
      // A tarefa some da derivação; o módulo pode voltar a INICIADO/EM_PROCESSO.
      await this.syncHierarchy(tx, [existing?.moduleId]);
    });
  }

  async findByAssignee(assigneeId: string): Promise<Task[]> {
    const raws = await this.prisma.task.findMany({ where: { assigneeId } });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async findByUrgentBlockedById(urgentTaskId: string): Promise<Task[]> {
    const raws = await this.prisma.task.findMany({ where: { urgentBlockedById: urgentTaskId } });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const raws = await this.prisma.task.findMany({ where: { projectId } });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async setTaskUrgent(id: string, isUrgent: boolean): Promise<void> {
    await this.prisma.task.update({
      where: { id },
      data: { isUrgent },
    });
  }

  async updateActualHours(taskId: string, hours: number): Promise<void> {
    await this.prisma.task.update({
      where: { id: taskId },
      data: { actualHours: hours },
    });
  }

  async updateKanbanOrder(input: KanbanOrderUpdate): Promise<void> {
    const completedAt = input.targetStatus === TaskStatus.CONCLUIDA ? new Date() : null;
    const sourceTaskIds =
      input.sourceStatus && input.sourceStatus !== input.targetStatus
        ? input.sourceTaskIds ?? []
        : [];

    const involvedIds = [...new Set([...input.targetTaskIds, ...sourceTaskIds])];
    if (involvedIds.length === 0) return;

    await this.prisma.$transaction(
      async (tx) => {
        // Reordena/promove as tarefas movidas e recalcula a hierarquia no mesmo
        // commit (origem e destino podem estar em módulos diferentes).
        for (const [index, id] of input.targetTaskIds.entries()) {
          await tx.task.update({
            where: { id },
            data: {
              status: input.targetStatus,
              order: index,
              ...(id === input.taskId ? { completedAt } : {}),
            },
          });
        }
        for (const [index, id] of sourceTaskIds.entries()) {
          await tx.task.update({
            where: { id },
            data: { status: input.sourceStatus, order: index },
          });
        }
        const involved = await tx.task.findMany({
          where: { id: { in: involvedIds } },
          select: { moduleId: true },
        });
        await this.syncHierarchy(tx, involved.map((t) => t.moduleId));
      },
      { timeout: 60_000 },
    );
  }
}
