import { Epic } from '../entities/epic.entity';
import { ProjectStatus } from '../entities/enums';

export interface UpdateEpicData {
  moduleId?: string;
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: Date;
  endDate?: Date | null;
  progress?: number;
  developerIds?: string[];
}

export interface IEpicRepository {
  create(epic: Epic): Promise<Epic>;
  update(id: string, data: UpdateEpicData): Promise<Epic>;
  findById(id: string): Promise<Epic | null>;
  listByModule(moduleId: string): Promise<Epic[]>;
  listByProject(projectId: string): Promise<Epic[]>;
  delete(id: string): Promise<void>;
}

export const IEpicRepositoryToken = Symbol('IEpicRepository');
