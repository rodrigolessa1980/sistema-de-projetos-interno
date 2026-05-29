import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';
import { Project } from '../../domain/entities/project.entity';
import { ProjectStatus } from '../../domain/entities/enums';

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  ownerId?: string;
  endDate?: Date | null;
  estimatedHours?: number;
  color?: string;
  testUrl?: string | null;
  progress?: number;
}

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(input: UpdateProjectInput): Promise<Project> {
    const existing = await this.projectRepository.findById(input.id);
    if (!existing) throw new NotFoundException('Projeto não encontrado.');

    const updated = new Project({
      id: existing.id,
      companyId: existing.companyId,
      name: input.name ?? existing.name,
      description: input.description ?? existing.description,
      status: input.status ?? existing.status,
      ownerId: input.ownerId ?? existing.ownerId,
      startDate: existing.startDate,
      endDate: input.endDate !== undefined ? input.endDate : existing.endDate,
      estimatedHours: input.estimatedHours ?? existing.estimatedHours,
      actualHours: existing.actualHours,
      progress: input.progress ?? existing.progress,
      color: input.color ?? existing.color,
      avatar: existing.avatar,
      testUrl: input.testUrl !== undefined ? input.testUrl : existing.testUrl,
      queueOrder: existing.queueOrder,
      createdAt: existing.createdAt,
    });
    return this.projectRepository.update(updated);
  }
}
