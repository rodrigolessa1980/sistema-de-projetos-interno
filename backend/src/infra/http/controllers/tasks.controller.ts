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
import { CreateCommentUseCase, DeleteCommentUseCase } from '../../../core/use-cases/tasks/comment.use-cases';
import {
  CreateSubtaskUseCase,
  UpdateSubtaskUseCase,
  DeleteSubtaskUseCase,
} from '../../../core/use-cases/tasks/subtask.use-cases';
import {
  CreateTaskDependencyUseCase,
  DeleteTaskDependencyUseCase,
} from '../../../core/use-cases/tasks/task-dependency.use-cases';
import {
  CreateTaskAttachmentUseCase,
  ListTaskAttachmentsUseCase,
  DeleteTaskAttachmentUseCase,
} from '../../../core/use-cases/tasks/task-attachment.use-cases';
import {
  CreateTaskNoteUseCase,
  UpdateTaskNoteUseCase,
  DeleteTaskNoteUseCase,
} from '../../../core/use-cases/tasks/task-note.use-cases';
import { CreateCommentDto } from '../dtos/tasks/comment.dto';
import { CreateSubtaskDto, UpdateSubtaskDto } from '../dtos/tasks/subtask.dto';
import { CreateTaskDependencyDto } from '../dtos/tasks/task-dependency.dto';
import { CreateTaskAttachmentDto } from '../dtos/tasks/create-task-attachment.dto';
import { CreateTaskNoteDto, UpdateTaskNoteDto } from '../dtos/tasks/task-note.dto';
import { Comment } from '../../../core/domain/entities/comment.entity';
import { Subtask } from '../../../core/domain/entities/subtask.entity';
import { TaskDependency } from '../../../core/domain/entities/task-dependency.entity';
import { TaskAttachment } from '../../../core/domain/entities/task-attachment.entity';
import { TaskNote } from '../../../core/domain/entities/task-note.entity';

function commentToHTTP(c: Comment) {
  return {
    id: c.id,
    taskId: c.taskId,
    userId: c.userId,
    content: c.content,
    mentions: c.mentions,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

function subtaskToHTTP(s: Subtask) {
  return {
    id: s.id,
    taskId: s.taskId,
    title: s.title,
    completed: s.completed,
    assigneeId: s.assigneeId ?? undefined,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

function dependencyToHTTP(d: TaskDependency) {
  return {
    id: d.id,
    taskId: d.taskId,
    dependsOnTaskId: d.dependsOnTaskId,
    type: d.type,
    createdAt: d.createdAt.toISOString(),
  };
}

function taskAttachmentToHTTP(a: TaskAttachment) {
  return {
    id: a.id,
    taskId: a.taskId,
    userId: a.userId,
    name: a.name,
    type: a.type,
    size: a.size,
    dataUrl: a.dataUrl,
    createdAt: a.createdAt.toISOString(),
  };
}

function taskNoteToHTTP(n: TaskNote) {
  return {
    id: n.id,
    taskId: n.taskId,
    userId: n.userId,
    content: n.content,
    isPinned: n.isPinned,
    createdAt: n.createdAt.toISOString(),
    updatedAt: n.updatedAt.toISOString(),
  };
}

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
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly createSubtaskUseCase: CreateSubtaskUseCase,
    private readonly updateSubtaskUseCase: UpdateSubtaskUseCase,
    private readonly deleteSubtaskUseCase: DeleteSubtaskUseCase,
    private readonly createTaskDependencyUseCase: CreateTaskDependencyUseCase,
    private readonly deleteTaskDependencyUseCase: DeleteTaskDependencyUseCase,
    private readonly createTaskAttachmentUseCase: CreateTaskAttachmentUseCase,
    private readonly listTaskAttachmentsUseCase: ListTaskAttachmentsUseCase,
    private readonly deleteTaskAttachmentUseCase: DeleteTaskAttachmentUseCase,
    private readonly createTaskNoteUseCase: CreateTaskNoteUseCase,
    private readonly updateTaskNoteUseCase: UpdateTaskNoteUseCase,
    private readonly deleteTaskNoteUseCase: DeleteTaskNoteUseCase,
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
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
  ): Promise<TaskResponse> {
    const task = await this.updateTaskUseCase.execute({
      id,
      actorUserId: req.userId,
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
      completedAt: body.completedAt !== undefined ? (body.completedAt ? new Date(body.completedAt) : null) : undefined,
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

  // ── Comentários ──────────────────────────────────────────────────────────
  @Post(':id/comments')
  @RequirePermission('tasks:update')
  async addComment(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: CreateCommentDto,
  ) {
    const comment = await this.createCommentUseCase.execute({
      taskId: id,
      userId: req.userId,
      content: body.content,
      mentions: body.mentions,
    });
    return commentToHTTP(comment);
  }

  @Delete('comments/:commentId')
  @RequirePermission('tasks:update')
  async removeComment(@Param('commentId') commentId: string) {
    await this.deleteCommentUseCase.execute(commentId);
    return { success: true };
  }

  // ── Subtarefas ───────────────────────────────────────────────────────────
  @Post(':id/subtasks')
  @RequirePermission('tasks:update')
  async addSubtask(@Param('id') id: string, @Body() body: CreateSubtaskDto) {
    const subtask = await this.createSubtaskUseCase.execute({
      taskId: id,
      title: body.title,
      assigneeId: body.assigneeId ?? null,
    });
    return subtaskToHTTP(subtask);
  }

  @Patch('subtasks/:subtaskId')
  @RequirePermission('tasks:update')
  async updateSubtask(@Param('subtaskId') subtaskId: string, @Body() body: UpdateSubtaskDto) {
    const subtask = await this.updateSubtaskUseCase.execute(subtaskId, {
      title: body.title,
      completed: body.completed,
      assigneeId: body.assigneeId,
    });
    return subtaskToHTTP(subtask);
  }

  @Delete('subtasks/:subtaskId')
  @RequirePermission('tasks:update')
  async removeSubtask(@Param('subtaskId') subtaskId: string) {
    await this.deleteSubtaskUseCase.execute(subtaskId);
    return { success: true };
  }

  // ── Dependências ─────────────────────────────────────────────────────────
  @Post(':id/dependencies')
  @RequirePermission('tasks:update')
  async addDependency(@Param('id') id: string, @Body() body: CreateTaskDependencyDto) {
    const dependency = await this.createTaskDependencyUseCase.execute({
      taskId: id,
      dependsOnTaskId: body.dependsOnTaskId,
      type: body.type,
    });
    return dependencyToHTTP(dependency);
  }

  @Delete('dependencies/:dependencyId')
  @RequirePermission('tasks:update')
  async removeDependency(@Param('dependencyId') dependencyId: string) {
    await this.deleteTaskDependencyUseCase.execute(dependencyId);
    return { success: true };
  }

  // ── Anexos (carregados sob demanda; base64 pesado) ───────────────────────
  @Get(':id/attachments')
  @RequirePermission('tasks:read')
  async listAttachments(@Param('id') id: string) {
    const attachments = await this.listTaskAttachmentsUseCase.execute(id);
    return { attachments: attachments.map(taskAttachmentToHTTP) };
  }

  @Post(':id/attachments')
  @RequirePermission('tasks:update')
  async addAttachment(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: CreateTaskAttachmentDto,
  ) {
    const attachment = await this.createTaskAttachmentUseCase.execute({
      taskId: id,
      userId: req.userId,
      name: body.name,
      type: body.type,
      size: body.size,
      dataUrl: body.dataUrl,
    });
    return { attachment: taskAttachmentToHTTP(attachment) };
  }

  @Delete('attachments/:attachmentId')
  @RequirePermission('tasks:update')
  async removeAttachment(@Param('attachmentId') attachmentId: string) {
    await this.deleteTaskAttachmentUseCase.execute(attachmentId);
    return { success: true };
  }

  // ── Anotações (notes) ────────────────────────────────────────────────────
  @Post(':id/notes')
  @RequirePermission('tasks:update')
  async addNote(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: CreateTaskNoteDto,
  ) {
    const note = await this.createTaskNoteUseCase.execute({
      taskId: id,
      userId: req.userId,
      content: body.content,
    });
    return taskNoteToHTTP(note);
  }

  @Patch('notes/:noteId')
  @RequirePermission('tasks:update')
  async updateNote(@Param('noteId') noteId: string, @Body() body: UpdateTaskNoteDto) {
    const note = await this.updateTaskNoteUseCase.execute(noteId, {
      content: body.content,
      isPinned: body.isPinned,
    });
    return taskNoteToHTTP(note);
  }

  @Delete('notes/:noteId')
  @RequirePermission('tasks:update')
  async removeNote(@Param('noteId') noteId: string) {
    await this.deleteTaskNoteUseCase.execute(noteId);
    return { success: true };
  }
}
