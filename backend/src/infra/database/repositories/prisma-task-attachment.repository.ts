import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ITaskAttachmentRepository } from '../../../core/domain/repositories/task-attachment-repository.interface';
import { TaskAttachment } from '../../../core/domain/entities/task-attachment.entity';

@Injectable()
export class PrismaTaskAttachmentRepository implements ITaskAttachmentRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): TaskAttachment {
    return new TaskAttachment({
      id: raw.id,
      taskId: raw.taskId,
      userId: raw.userId,
      name: raw.name,
      type: raw.type,
      size: raw.size,
      dataUrl: raw.dataUrl,
      createdAt: raw.createdAt,
    });
  }

  async create(attachment: TaskAttachment): Promise<TaskAttachment> {
    const raw = await this.prisma.taskAttachment.create({
      data: {
        id: attachment.id || undefined,
        taskId: attachment.taskId,
        userId: attachment.userId,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        dataUrl: attachment.dataUrl,
      },
    });
    return this.mapToDomain(raw);
  }

  async listByTask(taskId: string): Promise<TaskAttachment[]> {
    // A extensão de tenant filtra `deletedAt: null` automaticamente (o modelo
    // tem soft delete), então anexos excluídos não aparecem.
    const raws = await this.prisma.taskAttachment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
    });
    return raws.map((r) => this.mapToDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.taskAttachment.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
