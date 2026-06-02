import { Inject, Injectable } from '@nestjs/common';
import { Epic } from '../../domain/entities/epic.entity';
import type { IEpicRepository } from '../../domain/repositories/epic-repository.interface';
import { IEpicRepositoryToken } from '../../domain/repositories/epic-repository.interface';

export interface CreateEpicInput {
  projectId: string;
  moduleId: string;
  name: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  developerIds?: string[];
}

@Injectable()
export class CreateEpicUseCase {
  constructor(
    @Inject(IEpicRepositoryToken)
    private readonly epicRepository: IEpicRepository,
  ) {}

  async execute(input: CreateEpicInput): Promise<Epic> {
    const epic = new Epic({
      projectId: input.projectId,
      moduleId: input.moduleId,
      name: input.name,
      description: input.description,
      startDate: input.startDate,
      endDate: input.endDate ?? null,
      developerIds: input.developerIds ?? [],
    });
    return this.epicRepository.create(epic);
  }
}
