import { Inject, Injectable } from '@nestjs/common';
import { Comment } from '../../domain/entities/comment.entity';
import type { ICommentRepository } from '../../domain/repositories/comment-repository.interface';
import { ICommentRepositoryToken } from '../../domain/repositories/comment-repository.interface';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { NotificationService } from '../../services/notification.service';
import { AuditService } from '../../services/audit.service';
import { NotificationType, AuditAction } from '../../domain/entities/enums';

export interface CreateCommentInput {
  taskId: string;
  userId: string;
  content: string;
  mentions?: string[];
}

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(ICommentRepositoryToken)
    private readonly commentRepository: ICommentRepository,
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
  ) {}

  async execute(input: CreateCommentInput): Promise<Comment> {
    const content = input.content.trim();
    if (!content) throw new Error('O comentário não pode ser vazio');
    const comment = await this.commentRepository.create(
      new Comment({
        taskId: input.taskId,
        userId: input.userId,
        content,
        mentions: input.mentions ?? [],
      }),
    );

    // Avisa quem está envolvido na tarefa (responsável e autor), menos quem comentou.
    const task = await this.taskRepository.findById(input.taskId);
    this.audit.describe({
      action: AuditAction.COMMENTED,
      description: task ? `Comentou em "${task.title}"` : 'Comentou na tarefa',
    });
    if (task) {
      const targets = new Set([task.assigneeId, task.reporterId].filter(Boolean) as string[]);
      targets.delete(input.userId);
      const preview = content.length > 80 ? `${content.slice(0, 80)}…` : content;
      for (const userId of targets) {
        await this.notifications.notify({
          userId,
          type: NotificationType.COMMENT_ADDED,
          title: 'Novo comentário',
          message: `Novo comentário em "${task.title}": ${preview}`,
          relatedTaskId: task.id,
          relatedProjectId: task.projectId,
        });
      }
    }

    return comment;
  }
}

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(ICommentRepositoryToken)
    private readonly commentRepository: ICommentRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}
