import { ReorderKanbanTasksUseCase } from '../../../core/use-cases/tasks/reorder-kanban-tasks.use-case';
import { ReorderKanbanTasksDto } from '../dtos/tasks/reorder-kanban-tasks.dto';
export declare class TasksController {
    private readonly reorderKanbanTasksUseCase;
    constructor(reorderKanbanTasksUseCase: ReorderKanbanTasksUseCase);
    reorderKanban(body: ReorderKanbanTasksDto): Promise<{
        success: boolean;
    }>;
}
