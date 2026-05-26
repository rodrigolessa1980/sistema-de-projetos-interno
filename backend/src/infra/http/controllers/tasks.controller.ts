import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ReorderKanbanTasksUseCase } from '../../../core/use-cases/tasks/reorder-kanban-tasks.use-case';
import { ReorderKanbanTasksDto } from '../dtos/tasks/reorder-kanban-tasks.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly reorderKanbanTasksUseCase: ReorderKanbanTasksUseCase,
  ) {}

  @Patch('kanban/order')
  async reorderKanban(@Body() body: ReorderKanbanTasksDto) {
    await this.reorderKanbanTasksUseCase.execute(body);
    return { success: true };
  }
}
