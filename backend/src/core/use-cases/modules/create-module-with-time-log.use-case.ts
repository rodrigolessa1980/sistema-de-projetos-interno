import { Inject, Injectable } from '@nestjs/common';
import type {
  CreateModuleCompleteResult,
  IModuleRepository,
} from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';
import type { ModuleAttachmentInput } from '../../domain/repositories/module-repository.interface';

export interface CreateModuleWithTimeLogInput {
  projectId: string;
  name: string;
  description: string;
  order?: number;
  userId: string;
  hours?: number;
  workDate?: Date;
  attachments?: ModuleAttachmentInput[];
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

@Injectable()
export class CreateModuleWithTimeLogUseCase {
  constructor(
    @Inject(IModuleRepositoryToken)
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async execute(input: CreateModuleWithTimeLogInput): Promise<CreateModuleCompleteResult> {
    for (const att of input.attachments ?? []) {
      if (att.size > MAX_ATTACHMENT_BYTES) {
        throw new Error(`O arquivo "${att.name}" excede o limite de 10MB`);
      }
    }

    return this.moduleRepository.createComplete({
      projectId: input.projectId,
      name: input.name,
      description: input.description,
      order: input.order,
      userId: input.userId,
      hours: input.hours,
      workDate: input.workDate,
      attachments: input.attachments,
    });
  }
}
