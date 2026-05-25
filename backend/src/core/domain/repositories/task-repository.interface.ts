import { Task } from '../entities/task.entity';

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
  findByAssignee(assigneeId: string): Promise<Task[]>;
  findByProjectId(projectId: string): Promise<Task[]>;
  setTaskUrgent(id: string, isUrgent: boolean): Promise<void>;
}
export const ITaskRepositoryToken = Symbol('ITaskRepository');
