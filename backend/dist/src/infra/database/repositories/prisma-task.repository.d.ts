import { PrismaService } from '../prisma/prisma.service';
import { ITaskRepository, KanbanOrderUpdate } from '../../../core/domain/repositories/task-repository.interface';
import { Task } from '../../../core/domain/entities/task.entity';
export declare class PrismaTaskRepository implements ITaskRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToDomain;
    findById(id: string): Promise<Task | null>;
    create(task: Task): Promise<Task>;
    update(task: Task): Promise<Task>;
    delete(id: string): Promise<void>;
    findByAssignee(assigneeId: string): Promise<Task[]>;
    findByProjectId(projectId: string): Promise<Task[]>;
    setTaskUrgent(id: string, isUrgent: boolean): Promise<void>;
    updateKanbanOrder(input: KanbanOrderUpdate): Promise<void>;
}
