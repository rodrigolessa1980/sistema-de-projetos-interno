import { Inject, Injectable } from '@nestjs/common';
import { ModuleAttachment } from '../../domain/entities/module-attachment.entity';
import type { IModuleAttachmentRepository } from '../../domain/repositories/module-attachment-repository.interface';
import { IModuleAttachmentRepositoryToken } from '../../domain/repositories/module-attachment-repository.interface';

@Injectable()
export class ListModuleAttachmentsByProjectUseCase {
  constructor(
    @Inject(IModuleAttachmentRepositoryToken)
    private readonly moduleAttachmentRepository: IModuleAttachmentRepository,
  ) {}

  async execute(projectId: string): Promise<ModuleAttachment[]> {
    return this.moduleAttachmentRepository.listByProject(projectId);
  }
}
