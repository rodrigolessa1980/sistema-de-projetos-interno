import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/entities/enums';
import { ReleaseUrgencyBlocksUseCase } from './release-urgency-blocks.use-case';

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
  isUrgent?: boolean;
  blockedReason?: string | null;
}

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    private readonly releaseUrgencyBlocksUseCase: ReleaseUrgencyBlocksUseCase,
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
      completedAt: newStatus === TaskStatus.CONCLUIDA ? new Date() : (newStatus !== oldStatus ? null : existing.completedAt),
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
      const newAssigneeTasks = await this.taskRepository.findByAssignee(newAssigneeId);
      for (const t of newAssigneeTasks) {
        if (t.id !== saved.id && t.status !== TaskStatus.CONCLUIDA && t.status !== TaskStatus.CANCELADA) {
          t.blockDueToUrgency(saved.id);
          await this.taskRepository.update(t);
        }
      }
    } else if (wasActiveAndUrgent && isActiveAndUrgent && oldAssigneeId !== newAssigneeId) {
      // Continua ativa e urgente, mas mudou de desenvolvedor
      await this.releaseUrgencyBlocksUseCase.execute(saved.id);
      // Bloquear as do novo assignee
      const newAssigneeTasks = await this.taskRepository.findByAssignee(newAssigneeId);
      for (const t of newAssigneeTasks) {
        if (t.id !== saved.id && t.status !== TaskStatus.CONCLUIDA && t.status !== TaskStatus.CANCELADA) {
          t.blockDueToUrgency(saved.id);
          await this.taskRepository.update(t);
        }
      }
    } else if (
      (newStatus === TaskStatus.CONCLUIDA || newStatus === TaskStatus.CANCELADA) &&
      oldStatus !== newStatus
    ) {
      await this.releaseUrgencyBlocksUseCase.execute(saved.id);
    }

    return saved;
  }
}
