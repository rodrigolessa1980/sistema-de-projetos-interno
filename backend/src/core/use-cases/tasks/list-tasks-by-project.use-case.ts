import { Inject, Injectable } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { Task } from '../../domain/entities/task.entity';

@Injectable()
export class ListTasksByProjectUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(projectId: string): Promise<Task[]> {
    return this.taskRepository.findByProjectId(projectId);
  }
}
