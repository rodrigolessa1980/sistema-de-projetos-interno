import { Project } from '../entities/project.entity';

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  delete(id: string): Promise<void>;
  listAll(): Promise<Project[]>;
  findByCompanyId(companyId: string): Promise<Project[]>;
  getQueuedProjects(): Promise<Project[]>;
  updateQueueOrder(orderedIds: string[]): Promise<void>;
  addDeveloper(projectId: string, userId: string): Promise<void>;
  removeDeveloper(projectId: string, userId: string): Promise<void>;
  updateActualHours(projectId: string, hours: number): Promise<void>;
}
export const IProjectRepositoryToken = Symbol('IProjectRepository');
