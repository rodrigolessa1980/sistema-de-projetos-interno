import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, type AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
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
import { UserRole } from '../../../core/domain/entities/enums';

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  @RequirePermission('tasks:create')
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

  @Get('me')
  @RequirePermission('tasks:read')
  async listMine(@Req() req: AuthenticatedRequest): Promise<TaskResponse[]> {
    const tasks = await this.listTasksByAssigneeUseCase.execute(req.userId);
    return tasks.map(TaskPresenter.toHTTP);
  }

  @Get('project/:projectId')
  @RequirePermission('tasks:read')
  async listByProject(@Param('projectId') projectId: string): Promise<TaskResponse[]> {
    const tasks = await this.listTasksByProjectUseCase.execute(projectId);
    return tasks.map(TaskPresenter.toHTTP);
  }

  @Get('assignee/:assigneeId')
  @RequirePermission('tasks:read')
  async listByAssignee(
    @Req() req: AuthenticatedRequest,
    @Param('assigneeId') assigneeId: string,
  ): Promise<TaskResponse[]> {
    if (
      assigneeId !== req.userId &&
      req.userRole !== UserRole.ADMIN &&
      !req.permissions.has('users:read')
    ) {
      throw new ForbiddenException('Você só pode listar suas próprias tarefas.');
    }
    const tasks = await this.listTasksByAssigneeUseCase.execute(assigneeId);
    return tasks.map(TaskPresenter.toHTTP);
  }

  @Patch('kanban/order')
  @RequirePermission('tasks:update')
  async reorderKanban(@Body() body: ReorderKanbanTasksDto) {
    await this.reorderKanbanTasksUseCase.execute(body);
    return { success: true };
  }

  @Get(':id')
  @RequirePermission('tasks:read')
  async getById(@Param('id') id: string): Promise<TaskResponse> {
    const task = await this.getTaskByIdUseCase.execute(id);
    return TaskPresenter.toHTTP(task);
  }

  @Put(':id')
  @RequirePermission('tasks:update')
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

  @Patch(':id/urgent')
  @RequirePermission('tasks:update')
  async setUrgent(
    @Param('id') id: string,
    @Body() body: SetTaskUrgentDto,
  ): Promise<TaskResponse> {
    const task = await this.setTaskUrgentUseCase.execute(id, body.isUrgent);
    return TaskPresenter.toHTTP(task);
  }

  // Sem @RequirePermission: a autorização (admin OU autor da tarefa) é feita
  // dentro do use-case, para que o autor possa excluir mesmo sem `tasks:delete`.
  @Delete(':id')
  async delete(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    await this.deleteTaskUseCase.execute(id, req.userId, req.userRole);
    return { success: true };
  }
}
