import { Epic } from '../entities/epic.entity';

export interface IEpicRepository {
  create(epic: Epic): Promise<Epic>;
  findById(id: string): Promise<Epic | null>;
  listByModule(moduleId: string): Promise<Epic[]>;
  listByProject(projectId: string): Promise<Epic[]>;
  delete(id: string): Promise<void>;
}

export const IEpicRepositoryToken = Symbol('IEpicRepository');
