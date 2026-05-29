import { Inject, Injectable } from '@nestjs/common';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';
import { Project } from '../../domain/entities/project.entity';

@Injectable()
export class GetQueuedProjectsUseCase {
  constructor(
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(): Promise<Project[]> {
    return this.projectRepository.getQueuedProjects();
  }
}
