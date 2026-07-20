import { Inject, Injectable } from '@nestjs/common';
import { TaskDependency } from '../../domain/entities/task-dependency.entity';
import { DependencyType } from '../../domain/entities/enums';
import type { ITaskDependencyRepository } from '../../domain/repositories/task-dependency-repository.interface';
import { ITaskDependencyRepositoryToken } from '../../domain/repositories/task-dependency-repository.interface';

export interface CreateTaskDependencyInput {
  taskId: string;
  dependsOnTaskId: string;
  type?: DependencyType;
}

@Injectable()
export class CreateTaskDependencyUseCase {
  constructor(
    @Inject(ITaskDependencyRepositoryToken)
    private readonly dependencyRepository: ITaskDependencyRepository,
  ) {}

  async execute(input: CreateTaskDependencyInput): Promise<TaskDependency> {
    if (input.taskId === input.dependsOnTaskId) {
      throw new Error('Uma tarefa não pode depender de si mesma');
    }
    return this.dependencyRepository.create(
      new TaskDependency({
        taskId: input.taskId,
        dependsOnTaskId: input.dependsOnTaskId,
        type: input.type ?? DependencyType.BLOCKED_BY,
      }),
    );
  }
}

@Injectable()
export class DeleteTaskDependencyUseCase {
  constructor(
    @Inject(ITaskDependencyRepositoryToken)
    private readonly dependencyRepository: ITaskDependencyRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.dependencyRepository.delete(id);
  }
}
