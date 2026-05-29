import { Inject, Injectable } from '@nestjs/common';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';
import { Project } from '../../domain/entities/project.entity';

export interface CreateProjectInput {
  companyId: string;
  name: string;
  description: string;
  ownerId: string;
  startDate: Date;
  endDate?: Date | null;
  estimatedHours?: number;
  color?: string;
  testUrl?: string | null;
}

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(input: CreateProjectInput): Promise<Project> {
    const project = new Project({
      companyId: input.companyId,
      name: input.name,
      description: input.description,
      ownerId: input.ownerId,
      startDate: input.startDate,
      endDate: input.endDate ?? null,
      estimatedHours: input.estimatedHours ?? 0,
      color: input.color ?? '#6366f1',
      testUrl: input.testUrl ?? null,
    });
    return this.projectRepository.create(project);
  }
}
