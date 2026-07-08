import { Task } from '../entities/task.entity';
import { TaskStatus } from '../entities/enums';

export interface KanbanOrderUpdate {
  taskId: string;
  targetStatus: TaskStatus;
  targetTaskIds: string[];
  sourceStatus?: TaskStatus;
  sourceTaskIds?: string[];
}

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  /** Persiste várias tasks numa única transação (evita N updates sequenciais). */
  bulkUpdate(tasks: Task[]): Promise<void>;
  delete(id: string): Promise<void>;
  findByAssignee(assigneeId: string): Promise<Task[]>;
  findByUrgentBlockedById(urgentTaskId: string): Promise<Task[]>;
  findByProjectId(projectId: string): Promise<Task[]>;
  setTaskUrgent(id: string, isUrgent: boolean): Promise<void>;
  updateKanbanOrder(input: KanbanOrderUpdate): Promise<void>;
  updateActualHours(taskId: string, hours: number): Promise<void>;
}
export const ITaskRepositoryToken = Symbol('ITaskRepository');
