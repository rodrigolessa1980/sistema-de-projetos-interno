import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { Task } from '../../domain/entities/task.entity';
import { TaskStatus } from '../../domain/entities/enums';

@Injectable()
export class SetTaskUrgentUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(taskId: string, isUrgent: boolean): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    if (task.isUrgent === isUrgent) {
      return task;
    }

    // Criamos uma nova instância com o valor atualizado de isUrgent
    const updatedTask = new Task({
      ...this.getTaskProps(task),
      isUrgent,
    });

    const savedTask = await this.taskRepository.update(updatedTask);

    // INC-08: coleta as tarefas afetadas e persiste tudo num único bulkUpdate.
    const assigneeTasks = await this.taskRepository.findByAssignee(savedTask.assigneeId);
    if (isUrgent) {
      // Bloquear todas as outras tarefas ativas do mesmo assignee
      const toBlock = assigneeTasks.filter(
        (t) => t.id !== savedTask.id && t.status !== TaskStatus.CONCLUIDA && t.status !== TaskStatus.CANCELADA,
      );
      for (const t of toBlock) t.blockDueToUrgency(savedTask.id);
      await this.taskRepository.bulkUpdate(toBlock);
    } else {
      // Liberar todas as tarefas bloqueadas por este
      const toRelease = assigneeTasks.filter((t) => t.urgentBlockedById === savedTask.id);
      for (const t of toRelease) t.releaseUrgencyBlock();
      await this.taskRepository.bulkUpdate(toRelease);
    }

    return savedTask;
  }

  // Helper para obter as propriedades de uma instância da Task
  private getTaskProps(task: Task) {
    return {
      id: task.id,
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
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
