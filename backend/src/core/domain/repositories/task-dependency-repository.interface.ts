import { TaskDependency } from '../entities/task-dependency.entity';

export interface ITaskDependencyRepository {
  create(dependency: TaskDependency): Promise<TaskDependency>;
  delete(id: string): Promise<void>;
}

export const ITaskDependencyRepositoryToken = Symbol('ITaskDependencyRepository');
