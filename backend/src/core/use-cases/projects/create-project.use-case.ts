import { Inject, Injectable } from '@nestjs/common';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';
import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/entities/enums';

export interface CreateProjectInput {
  companyId?: string | null;
  name?: string;
  description?: string;
  technicalDescription?: string | null;
  requestedBy?: string | null;
  ownerId: string;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date | null;
  estimatedHours?: number;
  color?: string;
  testUrl?: string | null;
  avatar?: string | null;
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
      name: input.name?.trim() || `Projeto ${new Date().toLocaleString('pt-BR')}`,
      description: input.description?.trim() || 'Projeto criado sem descricao.',
      technicalDescription: input.technicalDescription?.trim() || null,
      requestedBy: input.requestedBy?.trim() || null,
      ownerId: input.ownerId,
      status: input.status,
      startDate: input.startDate ?? new Date(),
      endDate: input.endDate ?? null,
      estimatedHours: input.estimatedHours ?? 0,
      color: input.color ?? '#6366f1',
      testUrl: input.testUrl ?? null,
      avatar: input.avatar ?? null,
    });
    return this.projectRepository.create(project);
  }
}
