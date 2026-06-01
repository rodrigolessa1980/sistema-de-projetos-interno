import { Inject, Injectable } from '@nestjs/common';
import { Epic } from '../../domain/entities/epic.entity';
import type { IEpicRepository } from '../../domain/repositories/epic-repository.interface';
import { IEpicRepositoryToken } from '../../domain/repositories/epic-repository.interface';

@Injectable()
export class ListEpicsByProjectUseCase {
  constructor(
    @Inject(IEpicRepositoryToken)
    private readonly epicRepository: IEpicRepository,
  ) {}

  async execute(projectId: string): Promise<Epic[]> {
    return this.epicRepository.listByProject(projectId);
  }
}
