import { ModuleAttachment } from '../entities/module-attachment.entity';

export interface IModuleAttachmentRepository {
  create(attachment: ModuleAttachment): Promise<ModuleAttachment>;
  listByProject(projectId: string): Promise<ModuleAttachment[]>;
  listByModule(moduleId: string): Promise<ModuleAttachment[]>;
  delete(id: string): Promise<void>;
}

export const IModuleAttachmentRepositoryToken = Symbol('IModuleAttachmentRepository');
