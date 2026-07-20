import { Inject, Injectable } from '@nestjs/common';
import { TaskAttachment } from '../../domain/entities/task-attachment.entity';
import type { ITaskAttachmentRepository } from '../../domain/repositories/task-attachment-repository.interface';
import { ITaskAttachmentRepositoryToken } from '../../domain/repositories/task-attachment-repository.interface';

export interface CreateTaskAttachmentInput {
  taskId: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

@Injectable()
export class CreateTaskAttachmentUseCase {
  constructor(
    @Inject(ITaskAttachmentRepositoryToken)
    private readonly attachmentRepository: ITaskAttachmentRepository,
  ) {}

  async execute(input: CreateTaskAttachmentInput): Promise<TaskAttachment> {
    if (input.size > MAX_ATTACHMENT_BYTES) {
      throw new Error(`O arquivo "${input.name}" excede o limite de 10MB`);
    }
    return this.attachmentRepository.create(
      new TaskAttachment({
        taskId: input.taskId,
        userId: input.userId,
        name: input.name,
        type: input.type,
        size: input.size,
        dataUrl: input.dataUrl,
      }),
    );
  }
}

@Injectable()
export class ListTaskAttachmentsUseCase {
  constructor(
    @Inject(ITaskAttachmentRepositoryToken)
    private readonly attachmentRepository: ITaskAttachmentRepository,
  ) {}

  async execute(taskId: string): Promise<TaskAttachment[]> {
    return this.attachmentRepository.listByTask(taskId);
  }
}

@Injectable()
export class DeleteTaskAttachmentUseCase {
  constructor(
    @Inject(ITaskAttachmentRepositoryToken)
    private readonly attachmentRepository: ITaskAttachmentRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.attachmentRepository.delete(id);
  }
}
