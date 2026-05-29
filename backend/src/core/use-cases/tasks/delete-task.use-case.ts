import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { TaskStatus } from '../../domain/entities/enums';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    const wasActiveAndUrgent = existing.isUrgent && existing.status !== TaskStatus.CONCLUIDA && existing.status !== TaskStatus.CANCELADA;

    if (wasActiveAndUrgent) {
      // Liberar todas as tarefas que estavam bloqueadas por esta
      const assigneeTasks = await this.taskRepository.findByAssignee(existing.assigneeId);
      for (const t of assigneeTasks) {
        if (t.urgentBlockedById === existing.id) {
          t.releaseUrgencyBlock();
          await this.taskRepository.update(t);
        }
      }
    }

    await this.taskRepository.delete(id);
  }
}
