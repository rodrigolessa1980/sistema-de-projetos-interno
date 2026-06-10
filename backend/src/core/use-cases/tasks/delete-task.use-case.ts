import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { ReleaseUrgencyBlocksUseCase } from './release-urgency-blocks.use-case';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    private readonly releaseUrgencyBlocksUseCase: ReleaseUrgencyBlocksUseCase,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    await this.releaseUrgencyBlocksUseCase.execute(existing.id);
    await this.taskRepository.delete(id);
  }
}
