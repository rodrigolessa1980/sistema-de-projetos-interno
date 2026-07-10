import { Inject, Injectable } from '@nestjs/common';
import { Epic } from '../../domain/entities/epic.entity';
import { ProjectStatus } from '../../domain/entities/enums';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { IEpicRepository } from '../../domain/repositories/epic-repository.interface';
import { IEpicRepositoryToken } from '../../domain/repositories/epic-repository.interface';

export interface UpdateEpicInput {
  id: string;
  moduleId?: string;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date | null;
  progress?: number;
  developerIds?: string[];
}

@Injectable()
export class UpdateEpicUseCase {
  constructor(
    @Inject(IEpicRepositoryToken)
    private readonly epicRepository: IEpicRepository,
  ) {}

  async execute(input: UpdateEpicInput): Promise<Epic> {
    const existing = await this.epicRepository.findById(input.id);
    if (!existing) {
      throw new NotFoundException('Epic não encontrado.');
    }

    return this.epicRepository.update(input.id, {
      moduleId: input.moduleId,
      name: input.name?.trim(),
      description: input.description,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      progress: input.progress,
      developerIds: input.developerIds,
    });
  }
}
