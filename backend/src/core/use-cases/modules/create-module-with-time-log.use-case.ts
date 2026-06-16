import { Inject, Injectable } from '@nestjs/common';
import { ModuleStatus } from '../../domain/entities/enums';
import type {
  CreateModuleCompleteResult,
  IModuleRepository,
  ModuleAttachmentInput,
} from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';

export interface CreateModuleWithTimeLogInput {
  projectId: string;
  name: string;
  description: string;
  status?: ModuleStatus;
  order?: number;
  userId: string;
  assignedUserId?: string;
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
      status: input.status,
      order: input.order,
      userId: input.userId,
      assignedUserId: input.assignedUserId,
      hours: input.hours,
      workDate: input.workDate,
      attachments: input.attachments,
    });
  }
}
