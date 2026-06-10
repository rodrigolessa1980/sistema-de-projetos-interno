import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ITaskRepository,
  KanbanOrderUpdate,
} from '../../../core/domain/repositories/task-repository.interface';
import { Task } from '../../../core/domain/entities/task.entity';
import { TaskStatus } from '../../../core/domain/entities/enums';

@Injectable()
export class PrismaTaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaService) {}

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
    const raw = await this.prisma.task.create({
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
    return this.mapToDomain(raw);
  }

  async update(task: Task): Promise<Task> {
    const raw = await this.prisma.task.update({
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
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
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

  async updateKanbanOrder(input: KanbanOrderUpdate): Promise<void> {
    const completedAt = input.targetStatus === TaskStatus.CONCLUIDA ? new Date() : null;
    const sourceTaskIds =
      input.sourceStatus && input.sourceStatus !== input.targetStatus
        ? input.sourceTaskIds ?? []
        : [];

    const targetUpdates = input.targetTaskIds.map((id, index) =>
      this.prisma.task.update({
        where: { id },
        data: {
          status: input.targetStatus,
          order: index,
          ...(id === input.taskId ? { completedAt } : {}),
        },
      }),
    );

    const sourceUpdates = sourceTaskIds.map((id, index) =>
      this.prisma.task.update({
        where: { id },
        data: {
          status: input.sourceStatus,
          order: index,
        },
      }),
    );

    const operations = [...targetUpdates, ...sourceUpdates];
    if (operations.length === 0) return;

    await this.prisma.$transaction(operations, { timeout: 60_000 });
  }
}
