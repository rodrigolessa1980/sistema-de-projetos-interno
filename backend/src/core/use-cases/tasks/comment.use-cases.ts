import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../../domain/entities/comment.entity';
import type { ICommentRepository } from '../../domain/repositories/comment-repository.interface';
import { ICommentRepositoryToken } from '../../domain/repositories/comment-repository.interface';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { NotificationService } from '../../services/notification.service';
import { AuditService } from '../../services/audit.service';
import { NotificationType, AuditAction, UserRole } from '../../domain/entities/enums';

/** Só o admin ou o próprio autor pode editar/apagar o comentário. */
function assertCanManage(comment: Comment, actorUserId: string, actorRole: UserRole): void {
  if (actorRole !== UserRole.ADMIN && comment.userId !== actorUserId) {
    throw new ForbiddenException('Você só pode editar ou apagar os seus próprios comentários.');
  }
}

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
export class UpdateCommentUseCase {
  constructor(
    @Inject(ICommentRepositoryToken)
    private readonly commentRepository: ICommentRepository,
    private readonly audit: AuditService,
  ) {}

  async execute(id: string, content: string, actorUserId: string, actorRole: UserRole): Promise<Comment> {
    const trimmed = content.trim();
    if (!trimmed) throw new Error('O comentário não pode ser vazio');
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new NotFoundException('Comentário não encontrado.');
    if (comment.deletedAt) throw new ForbiddenException('Comentário apagado não pode ser editado.');
    assertCanManage(comment, actorUserId, actorRole);
    this.audit.describe({ action: AuditAction.UPDATED, description: 'Editou um comentário' });
    return this.commentRepository.updateContent(id, trimmed);
  }
}

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    @Inject(ICommentRepositoryToken)
    private readonly commentRepository: ICommentRepository,
    private readonly audit: AuditService,
  ) {}

  async execute(id: string, actorUserId: string, actorRole: UserRole): Promise<Comment> {
    const comment = await this.commentRepository.findById(id);
    if (!comment) throw new NotFoundException('Comentário não encontrado.');
    assertCanManage(comment, actorUserId, actorRole);
    this.audit.describe({ action: AuditAction.DELETED, description: 'Apagou um comentário' });
    // Soft delete: o comentário permanece (marcado "apagado") para a thread e o log.
    return this.commentRepository.softDelete(id);
  }
}
