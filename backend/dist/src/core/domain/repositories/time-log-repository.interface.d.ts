import { TimeLog } from '../entities/time-log.entity';
export interface ITimeLogRepository {
    findById(id: string): Promise<TimeLog | null>;
    create(timeLog: TimeLog): Promise<TimeLog>;
    delete(id: string): Promise<void>;
    findByTaskId(taskId: string): Promise<TimeLog[]>;
    findByUserId(userId: string): Promise<TimeLog[]>;
    findActiveSessionByUserId(userId: string): Promise<TimeLog | null>;
}
export declare const ITimeLogRepositoryToken: unique symbol;
