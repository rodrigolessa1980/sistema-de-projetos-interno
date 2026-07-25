import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';
import { UserRole } from '../../domain/entities/enums';
import { assertCanModifyProject } from './project-access';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: string, requesterId: string, requesterRole: UserRole): Promise<void> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) throw new NotFoundException('Projeto não encontrado.');
    // Só o admin ou o dono (ownerId) do projeto pode excluí-lo.
    assertCanModifyProject(existing, requesterId, requesterRole);
    await this.projectRepository.delete(id);
  }
}
