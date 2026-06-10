import { Module } from '../entities/module.entity';
import { ModuleAttachment } from '../entities/module-attachment.entity';
import { Epic } from '../entities/epic.entity';
import { Task } from '../entities/task.entity';
import { TimeLog } from '../entities/time-log.entity';

export interface ModuleAttachmentInput {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
}

export interface CreateModuleCompleteInput {
  projectId: string;
  name: string;
  description: string;
  order?: number;
  userId: string;
  hours?: number;
  workDate?: Date;
  attachments?: ModuleAttachmentInput[];
}

export interface CreateModuleCompleteResult {
  module: Module;
  epic?: Epic;
  task?: Task;
  timeLog?: TimeLog;
  attachments: ModuleAttachment[];
}

export interface IModuleRepository {
  create(module: Module): Promise<Module>;
  createComplete(input: CreateModuleCompleteInput): Promise<CreateModuleCompleteResult>;
  findById(id: string): Promise<Module | null>;
  listByProject(projectId: string): Promise<Module[]>;
  update(id: string, data: { name?: string; description?: string }): Promise<Module>;
  delete(id: string): Promise<void>;
}

export const IModuleRepositoryToken = Symbol('IModuleRepository');
