import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ListProjectsUseCase } from '../../../core/use-cases/projects/list-projects.use-case';
import { GetProjectByIdUseCase } from '../../../core/use-cases/projects/get-project-by-id.use-case';
import { CreateProjectUseCase } from '../../../core/use-cases/projects/create-project.use-case';
import { UpdateProjectUseCase } from '../../../core/use-cases/projects/update-project.use-case';
import { DeleteProjectUseCase } from '../../../core/use-cases/projects/delete-project.use-case';
import { GetQueuedProjectsUseCase } from '../../../core/use-cases/projects/get-queued-projects.use-case';
import { ReorderQueueUseCase } from '../../../core/use-cases/projects/reorder-queue.use-case';
import { CreateProjectDto } from '../dtos/projects/create-project.dto';
import { UpdateProjectDto } from '../dtos/projects/update-project.dto';
import { ReorderQueueDto } from '../dtos/projects/reorder-queue.dto';
import { ProjectPresenter, ProjectResponse } from '../presenters/project.presenter';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly listProjectsUseCase: ListProjectsUseCase,
    private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly getQueuedProjectsUseCase: GetQueuedProjectsUseCase,
    private readonly reorderQueueUseCase: ReorderQueueUseCase,
  ) {}

  @Get()
  async listAll(): Promise<ProjectResponse[]> {
    const projects = await this.listProjectsUseCase.execute();
    return projects.map(ProjectPresenter.toHTTP);
  }

  @Get('queued')
  async getQueued(): Promise<ProjectResponse[]> {
    const projects = await this.getQueuedProjectsUseCase.execute();
    return projects.map(ProjectPresenter.toHTTP);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ProjectResponse> {
    const project = await this.getProjectByIdUseCase.execute(id);
    return ProjectPresenter.toHTTP(project);
  }

  @Post()
  async create(@Body() body: CreateProjectDto): Promise<ProjectResponse> {
    const project = await this.createProjectUseCase.execute({
      companyId: body.companyId,
      name: body.name,
      description: body.description,
      ownerId: body.ownerId,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      estimatedHours: body.estimatedHours,
      color: body.color,
      testUrl: body.testUrl,
    });
    return ProjectPresenter.toHTTP(project);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    const project = await this.updateProjectUseCase.execute({
      id,
      name: body.name,
      description: body.description,
      status: body.status,
      ownerId: body.ownerId,
      endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : undefined,
      estimatedHours: body.estimatedHours,
      color: body.color,
      testUrl: body.testUrl,
      progress: body.progress,
    });
    return ProjectPresenter.toHTTP(project);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.deleteProjectUseCase.execute(id);
    return { success: true };
  }

  @Post('queue/reorder')
  async reorderQueue(@Body() body: ReorderQueueDto): Promise<{ success: boolean }> {
    await this.reorderQueueUseCase.execute(body.orderedIds);
    return { success: true };
  }
}
