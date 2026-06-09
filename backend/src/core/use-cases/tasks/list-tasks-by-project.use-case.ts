import { Inject, Injectable } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { Task } from '../../domain/entities/task.entity';
import { ReleaseUrgencyBlocksUseCase } from './release-urgency-blocks.use-case';

@Injectable()
export class ListTasksByProjectUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    private readonly releaseUrgencyBlocksUseCase: ReleaseUrgencyBlocksUseCase,
  ) {}

  async execute(projectId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.findByProjectId(projectId);
    return this.releaseUrgencyBlocksUseCase.repairStaleBlocksInProject(tasks);
  }
}
