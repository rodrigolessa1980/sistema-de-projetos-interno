import { TaskStatus } from '../../../../core/domain/entities/enums';
export declare class ReorderKanbanTasksDto {
    taskId: string;
    targetStatus: TaskStatus;
    targetTaskIds: string[];
    sourceStatus?: TaskStatus;
    sourceTaskIds?: string[];
}
