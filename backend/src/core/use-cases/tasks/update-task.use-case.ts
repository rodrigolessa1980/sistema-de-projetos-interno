import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus, NotificationType, AuditAction } from '../../domain/entities/enums';
import { ReleaseUrgencyBlocksUseCase } from './release-urgency-blocks.use-case';
import { NotificationService } from '../../services/notification.service';
import { AuditService } from '../../services/audit.service';

const STATUS_LABEL: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: 'Backlog',
  [TaskStatus.PLANEJADA]: 'Planejada',
  [TaskStatus.BLOQUEADA]: 'Bloqueada',
  [TaskStatus.EM_DESENVOLVIMENTO]: 'Em Desenvolvimento',
  [TaskStatus.EM_REVISAO]: 'Em Revisão',
  [TaskStatus.HOMOLOGACAO]: 'Homologação',
  [TaskStatus.CONCLUIDA]: 'Concluída',
  [TaskStatus.CANCELADA]: 'Cancelada',
};

export interface UpdateTaskInput {
  id: string;
  projectId?: string;
  moduleId?: string;
  epicId?: string;
  parentTaskId?: string | null;
  title?: string;
  description?: string;
  status?: TaskStatus;
  complexity?: number;
  assigneeId?: string;
  reporterId?: string;
  estimatedHours?: number;
  actualHours?: number;
  startDate?: Date | null;
  dueDate?: Date | null;
  completedAt?: Date | null;
  isUrgent?: boolean;
  blockedReason?: string | null;
  /** Quem executou a ação (para não notificar a si mesmo). */
  actorUserId?: string;
}

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    private readonly releaseUrgencyBlocksUseCase: ReleaseUrgencyBlocksUseCase,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
  ) {}

  async execute(input: UpdateTaskInput): Promise<Task> {
    const existing = await this.taskRepository.findById(input.id);
    if (!existing) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const oldAssigneeId = existing.assigneeId;
    const newAssigneeId = input.assigneeId ?? oldAssigneeId;
    const oldIsUrgent = existing.isUrgent;
    const newIsUrgent = input.isUrgent !== undefined ? input.isUrgent : oldIsUrgent;
    const oldStatus = existing.status;
    const newStatus = input.status ?? oldStatus;

    const wasActiveAndUrgent = oldIsUrgent && oldStatus !== TaskStatus.CONCLUIDA && oldStatus !== TaskStatus.CANCELADA;
    const isActiveAndUrgent = newIsUrgent && newStatus !== TaskStatus.CONCLUIDA && newStatus !== TaskStatus.CANCELADA;

    // Criamos a nova instância da Task com os valores atualizados
    const updated = new Task({
      id: existing.id,
      projectId: input.projectId ?? existing.projectId,
      moduleId: input.moduleId ?? existing.moduleId,
      epicId: input.epicId ?? existing.epicId,
      parentTaskId: input.parentTaskId !== undefined ? input.parentTaskId : existing.parentTaskId,
      title: input.title ?? existing.title,
      description: input.description ?? existing.description,
      status: newStatus,
      complexity: input.complexity ?? existing.complexity,
      assigneeId: newAssigneeId,
      reporterId: input.reporterId ?? existing.reporterId,
      estimatedHours: input.estimatedHours ?? existing.estimatedHours,
      actualHours: input.actualHours ?? existing.actualHours,
      startDate: input.startDate !== undefined ? input.startDate : existing.startDate,
      dueDate: input.dueDate !== undefined ? input.dueDate : existing.dueDate,
      // Conclusão aceita data manual: usa a data informada; senão preserva a que
      // já existia; senão cai para "agora" (ex.: arrastar no Kanban). Fora de
      // CONCLUIDA, a invariante da entidade zera completedAt.
      completedAt:
        newStatus === TaskStatus.CONCLUIDA
          ? (input.completedAt !== undefined ? input.completedAt : (existing.completedAt ?? new Date()))
          : (newStatus !== oldStatus ? null : existing.completedAt),
      blockedReason: input.blockedReason !== undefined ? input.blockedReason : existing.blockedReason,
      isUrgent: newIsUrgent,
      urgentBlockedById: existing.urgentBlockedById,
      urgentPreviousStatus: existing.urgentPreviousStatus,
      order: existing.order,
      createdAt: existing.createdAt,
    });

    const saved = await this.taskRepository.update(updated);

    // Regras de transição de Urgência:
    if (wasActiveAndUrgent && !isActiveAndUrgent) {
      await this.releaseUrgencyBlocksUseCase.execute(saved.id);
    } else if (!wasActiveAndUrgent && isActiveAndUrgent) {
      // Passou a ser ativa e urgente
      // Bloquear todas as outras tarefas ativas do novo assignee
      await this.blockActiveTasksOfAssignee(newAssigneeId, saved.id);
    } else if (wasActiveAndUrgent && isActiveAndUrgent && oldAssigneeId !== newAssigneeId) {
      // Continua ativa e urgente, mas mudou de desenvolvedor
      await this.releaseUrgencyBlocksUseCase.execute(saved.id);
      // Bloquear as do novo assignee
      await this.blockActiveTasksOfAssignee(newAssigneeId, saved.id);
    } else if (
      (newStatus === TaskStatus.CONCLUIDA || newStatus === TaskStatus.CANCELADA) &&
      oldStatus !== newStatus
    ) {
      await this.releaseUrgencyBlocksUseCase.execute(saved.id);
    }

    const actor = input.actorUserId;
    // Reatribuição: o novo responsável (se não for quem editou) é avisado.
    if (newAssigneeId && newAssigneeId !== oldAssigneeId && newAssigneeId !== actor) {
      await this.notifications.notify({
        userId: newAssigneeId,
        type: NotificationType.TASK_ASSIGNED,
        title: 'Tarefa atribuída a você',
        message: `Você foi atribuído à tarefa "${saved.title}".`,
        relatedTaskId: saved.id,
        relatedProjectId: saved.projectId,
      });
    }
    // Conclusão: avisa o autor da tarefa (se não for quem concluiu).
    if (
      newStatus === TaskStatus.CONCLUIDA &&
      oldStatus !== TaskStatus.CONCLUIDA &&
      saved.reporterId &&
      saved.reporterId !== actor
    ) {
      await this.notifications.notify({
        userId: saved.reporterId,
        type: NotificationType.TASK_COMPLETED,
        title: 'Tarefa concluída',
        message: `A tarefa "${saved.title}" foi marcada como concluída.`,
        relatedTaskId: saved.id,
        relatedProjectId: saved.projectId,
      });
    }

    // Enriquece o audit log com o "antes/depois" que só o use-case conhece.
    if (newStatus !== oldStatus) {
      this.audit.describe({
        action: AuditAction.STATUS_CHANGED,
        description: `Alterou o status de "${STATUS_LABEL[oldStatus]}" para "${STATUS_LABEL[newStatus]}"`,
        previousValue: { status: oldStatus },
        newValue: { status: newStatus },
      });
    } else if (newAssigneeId !== oldAssigneeId) {
      this.audit.describe({
        action: AuditAction.ASSIGNED,
        description: 'Alterou o responsável da tarefa',
        previousValue: { assigneeId: oldAssigneeId },
        newValue: { assigneeId: newAssigneeId },
      });
    } else {
      this.audit.describe({
        action: AuditAction.UPDATED,
        description: `Atualizou a tarefa "${saved.title}"`,
      });
    }

    return saved;
  }

  /** INC-08: bloqueia as tarefas ativas do assignee num único bulkUpdate. */
  private async blockActiveTasksOfAssignee(assigneeId: string, urgentTaskId: string): Promise<void> {
    const assigneeTasks = await this.taskRepository.findByAssignee(assigneeId);
    const toBlock = assigneeTasks.filter(
      (t) => t.id !== urgentTaskId && t.status !== TaskStatus.CONCLUIDA && t.status !== TaskStatus.CANCELADA,
    );
    for (const t of toBlock) t.blockDueToUrgency(urgentTaskId);
    await this.taskRepository.bulkUpdate(toBlock);
  }
}
