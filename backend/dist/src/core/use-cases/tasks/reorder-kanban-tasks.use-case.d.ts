import { TaskStatus } from '../../domain/entities/enums';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
export interface ReorderKanbanTasksInput {
    taskId: string;
    targetStatus: TaskStatus;
    targetTaskIds: string[];
    sourceStatus?: TaskStatus;
    sourceTaskIds?: string[];
}
export declare class ReorderKanbanTasksUseCase {
    private readonly taskRepository;
    constructor(taskRepository: ITaskRepository);
    execute(input: ReorderKanbanTasksInput): Promise<void>;
}
