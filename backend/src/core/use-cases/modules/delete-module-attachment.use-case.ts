import { Inject, Injectable } from '@nestjs/common';
import type { IModuleAttachmentRepository } from '../../domain/repositories/module-attachment-repository.interface';
import { IModuleAttachmentRepositoryToken } from '../../domain/repositories/module-attachment-repository.interface';

@Injectable()
export class DeleteModuleAttachmentUseCase {
  constructor(
    @Inject(IModuleAttachmentRepositoryToken)
    private readonly moduleAttachmentRepository: IModuleAttachmentRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.moduleAttachmentRepository.delete(id);
  }
}
