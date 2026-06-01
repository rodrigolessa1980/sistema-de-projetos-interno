import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateModuleUseCase } from '../../../core/use-cases/modules/create-module.use-case';
import { ListModulesByProjectUseCase } from '../../../core/use-cases/modules/list-modules-by-project.use-case';
import { CreateEpicUseCase } from '../../../core/use-cases/epics/create-epic.use-case';
import { ListEpicsByProjectUseCase } from '../../../core/use-cases/epics/list-epics-by-project.use-case';
import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';

class CreateModuleDto {
  @IsString() @IsNotEmpty() projectId: string;
  @IsString() @IsNotEmpty() name: string;
  @IsOptional() @IsString() description?: string;
}

class CreateEpicDto {
  @IsString() @IsNotEmpty() projectId: string;
  @IsString() @IsNotEmpty() moduleId: string;
  @IsString() @IsNotEmpty() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}

function moduleToHTTP(m: any) {
  return {
    id: m.id,
    projectId: m.projectId,
    name: m.name,
    description: m.description,
    order: m.order,
    progress: m.progress,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
    updatedAt: m.updatedAt instanceof Date ? m.updatedAt.toISOString() : m.updatedAt,
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
    createdAt: e.createdAt instanceof Date ? e.createdAt.toISOString() : e.createdAt,
    updatedAt: e.updatedAt instanceof Date ? e.updatedAt.toISOString() : e.updatedAt,
  };
}

@Controller()
@UseGuards(JwtAuthGuard)
export class ModulesController {
  constructor(
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly listModulesByProjectUseCase: ListModulesByProjectUseCase,
    private readonly createEpicUseCase: CreateEpicUseCase,
    private readonly listEpicsByProjectUseCase: ListEpicsByProjectUseCase,
  ) {}

  @Get('projects/:projectId/modules')
  async listModules(@Param('projectId') projectId: string) {
    const modules = await this.listModulesByProjectUseCase.execute(projectId);
    return { modules: modules.map(moduleToHTTP) };
  }

  @Post('modules')
  async createModule(@Body() body: CreateModuleDto) {
    const module = await this.createModuleUseCase.execute({
      projectId: body.projectId,
      name: body.name,
      description: body.description ?? '',
    });
    return { module: moduleToHTTP(module) };
  }

  @Get('projects/:projectId/epics')
  async listEpics(@Param('projectId') projectId: string) {
    const epics = await this.listEpicsByProjectUseCase.execute(projectId);
    return { epics: epics.map(epicToHTTP) };
  }

  @Post('epics')
  async createEpic(@Body() body: CreateEpicDto) {
    const epic = await this.createEpicUseCase.execute({
      projectId: body.projectId,
      moduleId: body.moduleId,
      name: body.name,
      description: body.description ?? '',
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      endDate: body.endDate ? new Date(body.endDate) : null,
    });
    return { epic: epicToHTTP(epic) };
  }
}
