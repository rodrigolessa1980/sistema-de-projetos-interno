import { PrismaService } from '../prisma/prisma.service';
import { ITimeLogRepository } from '../../../core/domain/repositories/time-log-repository.interface';
import { TimeLog } from '../../../core/domain/entities/time-log.entity';
export declare class PrismaTimeLogRepository implements ITimeLogRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToDomain;
    findById(id: string): Promise<TimeLog | null>;
    create(timeLog: TimeLog): Promise<TimeLog>;
    delete(id: string): Promise<void>;
    findByTaskId(taskId: string): Promise<TimeLog[]>;
    findByUserId(userId: string): Promise<TimeLog[]>;
    findActiveSessionByUserId(userId: string): Promise<TimeLog | null>;
}
