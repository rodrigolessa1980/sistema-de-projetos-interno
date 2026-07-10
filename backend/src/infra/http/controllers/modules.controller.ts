import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { CreateModuleUseCase } from '../../../core/use-cases/modules/create-module.use-case';
import { CreateModuleWithTimeLogUseCase } from '../../../core/use-cases/modules/create-module-with-time-log.use-case';
import { UpdateModuleUseCase } from '../../../core/use-cases/modules/update-module.use-case';
import { DeleteModuleUseCase } from '../../../core/use-cases/modules/delete-module.use-case';
import { ListModulesByProjectUseCase } from '../../../core/use-cases/modules/list-modules-by-project.use-case';
import { ListModuleAttachmentsByProjectUseCase } from '../../../core/use-cases/modules/list-module-attachments-by-project.use-case';
import { CreateModuleAttachmentUseCase } from '../../../core/use-cases/modules/create-module-attachment.use-case';
import { DeleteModuleAttachmentUseCase } from '../../../core/use-cases/modules/delete-module-attachment.use-case';
import { CreateEpicUseCase } from '../../../core/use-cases/epics/create-epic.use-case';
import { UpdateEpicUseCase } from '../../../core/use-cases/epics/update-epic.use-case';
import { ListEpicsByProjectUseCase } from '../../../core/use-cases/epics/list-epics-by-project.use-case';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsArray, IsEnum, Max, MaxLength, Min } from 'class-validator';
import { LIMITS } from '../dtos/field-limits';
import { CreateModuleDto } from '../dtos/modules/create-module.dto';
import { CreateModuleAttachmentDto } from '../dtos/modules/create-module-attachment.dto';
import { TaskPresenter } from '../presenters/task.presenter';
import { TimeLogPresenter } from '../presenters/time-log.presenter';
import { ModuleStatus, ProjectStatus, UserRole } from '../../../core/domain/entities/enums';

class UpdateModuleDto {
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(LIMITS.module.name, { message: `O nome do módulo deve ter no máximo ${LIMITS.module.name} caracteres` }) name?: string;
  @IsOptional() @IsString() @MaxLength(LIMITS.module.description, { message: `A descrição do módulo deve ter no máximo ${LIMITS.module.description} caracteres` }) description?: string;
  @IsOptional() @IsEnum(ModuleStatus) status?: ModuleStatus;
  @IsOptional() @IsDateString() workDate?: string;
  @IsOptional() @IsNumber() hours?: number;
  @IsOptional() @IsString() assignedUserId?: string;
}

class CreateEpicDto {
  @IsString() @IsNotEmpty() projectId: string;
  @IsString() @IsNotEmpty() moduleId: string;
  @IsString() @IsNotEmpty() @MaxLength(LIMITS.epic.name, { message: `O nome do epic deve ter no máximo ${LIMITS.epic.name} caracteres` }) name: string;
  @IsOptional() @IsString() @MaxLength(LIMITS.epic.description, { message: `A descrição do epic deve ter no máximo ${LIMITS.epic.description} caracteres` }) description?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) developerIds?: string[];
}

class UpdateEpicDto {
  @IsOptional() @IsString() @IsNotEmpty() moduleId?: string;
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(LIMITS.epic.name, { message: `O nome do epic deve ter no máximo ${LIMITS.epic.name} caracteres` }) name?: string;
  @IsOptional() @IsString() @MaxLength(LIMITS.epic.description, { message: `A descrição do epic deve ter no máximo ${LIMITS.epic.description} caracteres` }) description?: string;
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string | null;
  @IsOptional() @IsInt() @Min(0) @Max(100) progress?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) developerIds?: string[];
}

function formatDateOnly(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return String(value).split('T')[0];
}

function moduleToHTTP(m: any) {
  return {
    id: m.id,
    projectId: m.projectId,
    name: m.name,
    description: m.description,
    status: m.status ?? ModuleStatus.INICIADO,
    order: m.order,
    progress: m.progress,
    workDate: formatDateOnly(m.workDate),
    loggedHours: m.loggedHours != null ? Number(m.loggedHours) : null,
    loggedByUserId: m.loggedByUserId ?? null,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
    updatedAt: m.updatedAt instanceof Date ? m.updatedAt.toISOString() : m.updatedAt,
  };
}

function moduleAttachmentToHTTP(a: any) {
  return {
    id: a.id,
    moduleId: a.moduleId,
    userId: a.userId,
    name: a.name,
    type: a.type,
    size: a.size,
    dataUrl: a.dataUrl,
    createdAt: a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
  };
}

function epicToHTTP(e: any) {
  return {
    id: e.id,
    projectId: e.projectId,
    moduleId: e.moduleId,
    name: e.name,
    description: e.description,
    status: e.status,
    startDate: e.startDate instanceof Date ? e.startDate.toISOString() : e.startDate,
    endDate: e.endDate instanceof Date ? e.endDate.toISOString() : (e.endDate ?? null),
    progress: e.progress,
    developerIds: e.developerIds ?? [],
    createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
    updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
  };
}

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ModulesController {
  constructor(
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly createModuleWithTimeLogUseCase: CreateModuleWithTimeLogUseCase,
    private readonly updateModuleUseCase: UpdateModuleUseCase,
    private readonly deleteModuleUseCase: DeleteModuleUseCase,
    private readonly listModulesByProjectUseCase: ListModulesByProjectUseCase,
    private readonly listModuleAttachmentsByProjectUseCase: ListModuleAttachmentsByProjectUseCase,
    private readonly createModuleAttachmentUseCase: CreateModuleAttachmentUseCase,
    private readonly deleteModuleAttachmentUseCase: DeleteModuleAttachmentUseCase,
    private readonly createEpicUseCase: CreateEpicUseCase,
    private readonly updateEpicUseCase: UpdateEpicUseCase,
    private readonly listEpicsByProjectUseCase: ListEpicsByProjectUseCase,
  ) {}

  @Get('projects/:projectId/modules')
  @RequirePermission('modules:read')
  async listModules(@Param('projectId') projectId: string) {
    const modules = await this.listModulesByProjectUseCase.execute(projectId);
    return { modules: modules.map(moduleToHTTP) };
  }

  @Get('projects/:projectId/module-attachments')
  @RequirePermission('modules:read')
  async listModuleAttachments(@Param('projectId') projectId: string) {
    const attachments = await this.listModuleAttachmentsByProjectUseCase.execute(projectId);
    return { attachments: attachments.map(moduleAttachmentToHTTP) };
  }

  @Post('modules')
  @RequirePermission('modules:create')
  async createModule(@Req() req: AuthenticatedRequest, @Body() body: CreateModuleDto) {
    const hasTimeLog = body.hours != null && body.hours > 0 && body.workDate;
    const hasAttachments = (body.attachments?.length ?? 0) > 0;

    if (hasTimeLog || hasAttachments) {
      // Só admin pode atribuir a outro usuário; demais registram para si mesmos.
      const assignedUserId = req.userRole === UserRole.ADMIN && body.assignedUserId
        ? body.assignedUserId
        : req.userId;
      const result = await this.createModuleWithTimeLogUseCase.execute({
        projectId: body.projectId,
        name: body.name,
        description: body.description ?? '',
        status: body.status,
        order: body.order,
        userId: req.userId,
        assignedUserId,
        hours: body.hours,
        workDate: body.workDate ? new Date(body.workDate) : undefined,
        attachments: body.attachments,
      });
      return {
        module: moduleToHTTP(result.module),
        epic: result.epic ? epicToHTTP(result.epic) : undefined,
        task: result.task ? TaskPresenter.toHTTP(result.task) : undefined,
        timeLog: result.timeLog ? TimeLogPresenter.toHTTP(result.timeLog) : undefined,
        attachments: result.attachments.map(moduleAttachmentToHTTP),
      };
    }

    const module = await this.createModuleUseCase.execute({
      projectId: body.projectId,
      name: body.name,
      description: body.description ?? '',
      status: body.status,
      order: body.order,
    });
    return { module: moduleToHTTP(module), attachments: [] };
  }

  @Post('modules/:moduleId/attachments')
  @RequirePermission('modules:update')
  async createModuleAttachment(
    @Req() req: AuthenticatedRequest,
    @Param('moduleId') moduleId: string,
    @Body() body: CreateModuleAttachmentDto,
  ) {
    const attachment = await this.createModuleAttachmentUseCase.execute({
      moduleId,
      userId: req.userId,
      name: body.name,
      type: body.type,
      size: body.size,
      dataUrl: body.dataUrl,
    });
    return { attachment: moduleAttachmentToHTTP(attachment) };
  }

  @Delete('module-attachments/:id')
  @HttpCode(204)
  @RequirePermission('modules:delete')
  async deleteModuleAttachment(@Param('id') id: string) {
    await this.deleteModuleAttachmentUseCase.execute(id);
  }

  @Patch('modules/:id')
  @RequirePermission('modules:update')
  async updateModule(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateModuleDto,
  ) {
    const module = await this.updateModuleUseCase.execute(id, {
      name: body.name,
      description: body.description,
      status: body.status,
      workDate: body.workDate ? new Date(`${body.workDate}T12:00:00.000Z`) : undefined,
      hours: body.hours,
      // Só admin pode trocar o usuário dono do registro.
      assignedUserId: req.userRole === UserRole.ADMIN ? body.assignedUserId : undefined,
    });
    return { module: moduleToHTTP(module) };
  }

  @Delete('modules/:id')
  @HttpCode(204)
  @RequirePermission('modules:delete')
  async deleteModule(@Param('id') id: string) {
    await this.deleteModuleUseCase.execute(id);
  }

  @Get('projects/:projectId/epics')
  @RequirePermission('epics:read')
  async listEpics(@Param('projectId') projectId: string) {
    const epics = await this.listEpicsByProjectUseCase.execute(projectId);
    return { epics: epics.map(epicToHTTP) };
  }

  @Post('epics')
  @RequirePermission('epics:create')
  async createEpic(@Body() body: CreateEpicDto) {
    const epic = await this.createEpicUseCase.execute({
      projectId: body.projectId,
      moduleId: body.moduleId,
      name: body.name,
      description: body.description ?? '',
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      endDate: body.endDate ? new Date(body.endDate) : null,
      developerIds: body.developerIds ?? [],
    });
    return { epic: epicToHTTP(epic) };
  }

  @Patch('epics/:id')
  @RequirePermission('epics:update')
  async updateEpic(@Param('id') id: string, @Body() body: UpdateEpicDto) {
    const epic = await this.updateEpicUseCase.execute({
      id,
      moduleId: body.moduleId,
      name: body.name,
      description: body.description,
      status: body.status,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      // endDate ausente => não altera; null => limpa; string => define.
      endDate:
        body.endDate === undefined ? undefined : body.endDate ? new Date(body.endDate) : null,
      progress: body.progress,
      developerIds: body.developerIds,
    });
    return { epic: epicToHTTP(epic) };
  }
}
