import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ISubtaskRepository,
  UpdateSubtaskFields,
} from '../../../core/domain/repositories/subtask-repository.interface';
import { Subtask } from '../../../core/domain/entities/subtask.entity';

@Injectable()
export class PrismaSubtaskRepository implements ISubtaskRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): Subtask {
    return new Subtask({
      id: raw.id,
      taskId: raw.taskId,
      title: raw.title,
      completed: raw.completed,
      assigneeId: raw.assigneeId ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(subtask: Subtask): Promise<Subtask> {
    const raw = await this.prisma.subtask.create({
      data: {
        id: subtask.id || undefined,
        taskId: subtask.taskId,
        title: subtask.title,
        completed: subtask.completed,
        assigneeId: subtask.assigneeId,
      },
    });
    return this.mapToDomain(raw);
  }

  async update(id: string, fields: UpdateSubtaskFields): Promise<Subtask> {
    const raw = await this.prisma.subtask.update({
      where: { id },
      data: {
        ...(fields.title !== undefined ? { title: fields.title } : {}),
        ...(fields.completed !== undefined ? { completed: fields.completed } : {}),
        ...(fields.assigneeId !== undefined ? { assigneeId: fields.assigneeId } : {}),
      },
    });
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subtask.delete({ where: { id } });
  }
}
