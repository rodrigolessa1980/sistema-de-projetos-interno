import { Inject, Injectable } from '@nestjs/common';
import { ModuleStatus, NotificationType } from '../../domain/entities/enums';
import type {
  CreateModuleCompleteResult,
  IModuleRepository,
  ModuleAttachmentInput,
} from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';
import { NotificationService } from '../../services/notification.service';

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
    private readonly notifications: NotificationService,
  ) {}

  async execute(input: CreateModuleWithTimeLogInput): Promise<CreateModuleCompleteResult> {
    for (const att of input.attachments ?? []) {
      if (att.size > MAX_ATTACHMENT_BYTES) {
        throw new Error(`O arquivo "${att.name}" excede o limite de 10MB`);
      }
    }

    const result = await this.moduleRepository.createComplete({
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

    // Módulo atribuído a outra pessoa: avisa quem recebeu.
    if (input.assignedUserId && input.assignedUserId !== input.userId) {
      await this.notifications.notify({
        userId: input.assignedUserId,
        type: NotificationType.PROJECT_UPDATED,
        title: 'Módulo atribuído a você',
        message: `Você foi atribuído ao módulo "${input.name}".`,
        relatedProjectId: input.projectId,
      });
    }

    return result;
  }
}
