import { TaskAttachment } from '../entities/task-attachment.entity';

export interface ITaskAttachmentRepository {
  create(attachment: TaskAttachment): Promise<TaskAttachment>;
  listByTask(taskId: string): Promise<TaskAttachment[]>;
  delete(id: string): Promise<void>;
}

export const ITaskAttachmentRepositoryToken = Symbol('ITaskAttachmentRepository');
