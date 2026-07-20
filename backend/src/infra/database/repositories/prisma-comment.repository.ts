import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICommentRepository } from '../../../core/domain/repositories/comment-repository.interface';
import { Comment } from '../../../core/domain/entities/comment.entity';

@Injectable()
export class PrismaCommentRepository implements ICommentRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): Comment {
    return new Comment({
      id: raw.id,
      taskId: raw.taskId,
      userId: raw.userId,
      content: raw.content,
      mentions: Array.isArray(raw.mentions) ? (raw.mentions as string[]) : [],
      deletedAt: raw.deletedAt ?? null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(comment: Comment): Promise<Comment> {
    const raw = await this.prisma.comment.create({
      data: {
        id: comment.id || undefined,
        taskId: comment.taskId,
        userId: comment.userId,
        content: comment.content,
        mentions: comment.mentions,
      },
    });
    return this.mapToDomain(raw);
  }

  async findById(id: string): Promise<Comment | null> {
    const raw = await this.prisma.comment.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async updateContent(id: string, content: string): Promise<Comment> {
    const raw = await this.prisma.comment.update({ where: { id }, data: { content } });
    return this.mapToDomain(raw);
  }

  async softDelete(id: string): Promise<Comment> {
    const raw = await this.prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
    return this.mapToDomain(raw);
  }
}
