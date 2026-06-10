import { Inject, Injectable } from '@nestjs/common';
import { ModuleAttachment } from '../../domain/entities/module-attachment.entity';
import type { IModuleAttachmentRepository } from '../../domain/repositories/module-attachment-repository.interface';
import { IModuleAttachmentRepositoryToken } from '../../domain/repositories/module-attachment-repository.interface';
import type { IModuleRepository } from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';

export interface CreateModuleAttachmentInput {
  moduleId: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

@Injectable()
export class CreateModuleAttachmentUseCase {
  constructor(
    @Inject(IModuleAttachmentRepositoryToken)
    private readonly moduleAttachmentRepository: IModuleAttachmentRepository,
    @Inject(IModuleRepositoryToken)
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async execute(input: CreateModuleAttachmentInput): Promise<ModuleAttachment> {
    if (input.size > MAX_ATTACHMENT_BYTES) {
      throw new Error(`O arquivo "${input.name}" excede o limite de 10MB`);
    }

    const module = await this.moduleRepository.findById(input.moduleId);
    if (!module) {
      throw new Error('Módulo não encontrado');
    }

    const attachment = new ModuleAttachment({
      moduleId: input.moduleId,
      userId: input.userId,
      name: input.name,
      type: input.type,
      size: input.size,
      dataUrl: input.dataUrl,
    });

    return this.moduleAttachmentRepository.create(attachment);
  }
}
