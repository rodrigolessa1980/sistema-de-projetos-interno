import { Inject, Injectable } from '@nestjs/common';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';

@Injectable()
export class ReorderQueueUseCase {
  constructor(
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(orderedIds: string[]): Promise<void> {
    await this.projectRepository.updateQueueOrder(orderedIds);
  }
}
