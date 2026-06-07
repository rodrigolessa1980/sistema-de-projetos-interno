import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateTaskUseCase } from '../../../core/use-cases/tasks/create-task.use-case';
import { UpdateTaskUseCase } from '../../../core/use-cases/tasks/update-task.use-case';
import { DeleteTaskUseCase } from '../../../core/use-cases/tasks/delete-task.use-case';
import { GetTaskByIdUseCase } from '../../../core/use-cases/tasks/get-task-by-id.use-case';
import { ListTasksByProjectUseCase } from '../../../core/use-cases/tasks/list-tasks-by-project.use-case';
import { ListTasksByAssigneeUseCase } from '../../../core/use-cases/tasks/list-tasks-by-assignee.use-case';
import { SetTaskUrgentUseCase } from '../../../core/use-cases/tasks/set-task-urgent.use-case';
import { ReorderKanbanTasksUseCase } from '../../../core/use-cases/tasks/reorder-kanban-tasks.use-case';
import { CreateTaskDto } from '../dtos/tasks/create-task.dto';
import { UpdateTaskDto } from '../dtos/tasks/update-task.dto';
import { SetTaskUrgentDto } from '../dtos/tasks/set-task-urgent.dto';
import { ReorderKanbanTasksDto } from '../dtos/tasks/reorder-kanban-tasks.dto';
import { TaskPresenter, TaskResponse } from '../presenters/task.presenter';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    private readonly listTasksByProjectUseCase: ListTasksByProjectUseCase,
    private readonly listTasksByAssigneeUseCase: ListTasksByAssigneeUseCase,
    private readonly setTaskUrgentUseCase: SetTaskUrgentUseCase,
    private readonly reorderKanbanTasksUseCase: ReorderKanbanTasksUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateTaskDto): Promise<TaskResponse> {
    const task = await this.createTaskUseCase.execute({
      projectId: body.projectId,
      moduleId: body.moduleId,
      epicId: body.epicId,
      parentTaskId: body.parentTaskId,
      title: body.title,
      description: body.description,
      complexity: body.complexity,
      assigneeId: body.assigneeId,
      reporterId: body.reporterId,
      estimatedHours: body.estimatedHours,
      actualHours: body.actualHours,
      order: body.order,
      blockedReason: body.blockedReason,
      startDate: body.startDate ? new Date(body.startDate) : null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      isUrgent: body.isUrgent,
      status: body.status,
    });
    return TaskPresenter.toHTTP(task);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskResponse> {
    const task = await this.updateTaskUseCase.execute({
      id,
      projectId: body.projectId,
      moduleId: body.moduleId,
      epicId: body.epicId,
      parentTaskId: body.parentTaskId,
      title: body.title,
      description: body.description,
      status: body.status,
      complexity: body.complexity,
      assigneeId: body.assigneeId,
      reporterId: body.reporterId,
      estimatedHours: body.estimatedHours,
      actualHours: body.actualHours,
      startDate: body.startDate !== undefined ? (body.startDate ? new Date(body.startDate) : null) : undefined,
      dueDate: body.dueDate !== undefined ? (body.dueDate ? new Date(body.dueDate) : null) : undefined,
      isUrgent: body.isUrgent,
      blockedReason: body.blockedReason,
    });
    return TaskPresenter.toHTTP(task);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.deleteTaskUseCase.execute(id);
    return { success: true };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<TaskResponse> {
    const task = await this.getTaskByIdUseCase.execute(id);
    return TaskPresenter.toHTTP(task);
  }

  @Get('project/:projectId')
  async listByProject(@Param('projectId') projectId: string): Promise<TaskResponse[]> {
    const tasks = await this.listTasksByProjectUseCase.execute(projectId);
    return tasks.map(TaskPresenter.toHTTP);
  }

  @Get('assignee/:assigneeId')
  async listByAssignee(@Param('assigneeId') assigneeId: string): Promise<TaskResponse[]> {
    const tasks = await this.listTasksByAssigneeUseCase.execute(assigneeId);
    return tasks.map(TaskPresenter.toHTTP);
  }

  @Patch(':id/urgent')
  async setUrgent(
    @Param('id') id: string,
    @Body() body: SetTaskUrgentDto,
  ): Promise<TaskResponse> {
    const task = await this.setTaskUrgentUseCase.execute(id, body.isUrgent);
    return TaskPresenter.toHTTP(task);
  }

  @Patch('kanban/order')
  async reorderKanban(@Body() body: ReorderKanbanTasksDto) {
    await this.reorderKanbanTasksUseCase.execute(body);
    return { success: true };
  }
}
