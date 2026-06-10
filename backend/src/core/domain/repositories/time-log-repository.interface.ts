import { TimeLog } from '../entities/time-log.entity';

export interface ITimeLogRepository {
  findById(id: string): Promise<TimeLog | null>;
  create(timeLog: TimeLog): Promise<TimeLog>;
  delete(id: string): Promise<void>;
  findByTaskId(taskId: string): Promise<TimeLog[]>;
  findByUserId(userId: string): Promise<TimeLog[]>;
  findByProjectId(projectId: string): Promise<TimeLog[]>;
  findActiveSessionByUserId(userId: string): Promise<TimeLog | null>;
  sumFinalizedHoursByTaskId(taskId: string): Promise<number>;
  sumFinalizedHoursByProjectId(projectId: string): Promise<number>;
}
export const ITimeLogRepositoryToken = Symbol('ITimeLogRepository');
