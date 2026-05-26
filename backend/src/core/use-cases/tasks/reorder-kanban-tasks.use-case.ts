import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TaskStatus } from '../../domain/entities/enums';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';

export interface ReorderKanbanTasksInput {
  taskId: string;
  targetStatus: TaskStatus;
  targetTaskIds: string[];
  sourceStatus?: TaskStatus;
  sourceTaskIds?: string[];
}

@Injectable()
export class ReorderKanbanTasksUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(input: ReorderKanbanTasksInput): Promise<void> {
    const task = await this.taskRepository.findById(input.taskId);
    if (!task) {
      throw new NotFoundException('Tarefa', input.taskId);
    }

    const targetIds = new Set(input.targetTaskIds);
    if (!targetIds.has(input.taskId)) {
      throw new BadRequestException('A tarefa movida precisa estar na lista de destino.');
    }

    if (targetIds.size !== input.targetTaskIds.length) {
      throw new BadRequestException('A lista de destino contém tarefas duplicadas.');
    }

    if (input.sourceTaskIds && new Set(input.sourceTaskIds).size !== input.sourceTaskIds.length) {
      throw new BadRequestException('A lista de origem contém tarefas duplicadas.');
    }

    await this.taskRepository.updateKanbanOrder(input);
  }
}
