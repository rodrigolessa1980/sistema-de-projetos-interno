import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ITaskNoteRepository,
  UpdateTaskNoteFields,
} from '../../../core/domain/repositories/task-note-repository.interface';
import { TaskNote } from '../../../core/domain/entities/task-note.entity';

@Injectable()
export class PrismaTaskNoteRepository implements ITaskNoteRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): TaskNote {
    return new TaskNote({
      id: raw.id,
      taskId: raw.taskId,
      userId: raw.userId,
      content: raw.content,
      isPinned: raw.isPinned,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(note: TaskNote): Promise<TaskNote> {
    const raw = await this.prisma.taskNote.create({
      data: {
        id: note.id || undefined,
        taskId: note.taskId,
        userId: note.userId,
        content: note.content,
        isPinned: note.isPinned,
      },
    });
    return this.mapToDomain(raw);
  }

  async update(id: string, fields: UpdateTaskNoteFields): Promise<TaskNote> {
    const raw = await this.prisma.taskNote.update({
      where: { id },
      data: {
        ...(fields.content !== undefined ? { content: fields.content } : {}),
        ...(fields.isPinned !== undefined ? { isPinned: fields.isPinned } : {}),
      },
    });
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.taskNote.delete({ where: { id } });
  }
}
