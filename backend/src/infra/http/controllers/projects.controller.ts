import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PROJECT_LIMITS } from '../dtos/projects/project.constraints';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { ListProjectsUseCase } from '../../../core/use-cases/projects/list-projects.use-case';
import { GetProjectByIdUseCase } from '../../../core/use-cases/projects/get-project-by-id.use-case';
import { CreateProjectUseCase } from '../../../core/use-cases/projects/create-project.use-case';
import { UpdateProjectUseCase } from '../../../core/use-cases/projects/update-project.use-case';
import { DeleteProjectUseCase } from '../../../core/use-cases/projects/delete-project.use-case';
import { GetQueuedProjectsUseCase } from '../../../core/use-cases/projects/get-queued-projects.use-case';
import { ReorderQueueUseCase } from '../../../core/use-cases/projects/reorder-queue.use-case';
import { AddDeveloperUseCase } from '../../../core/use-cases/projects/add-developer.use-case';
import { RemoveDeveloperUseCase } from '../../../core/use-cases/projects/remove-developer.use-case';
import { CreateProjectDto } from '../dtos/projects/create-project.dto';
import { UpdateProjectDto } from '../dtos/projects/update-project.dto';
import { ReorderQueueDto } from '../dtos/projects/reorder-queue.dto';
import { ProjectPresenter, ProjectResponse } from '../presenters/project.presenter';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { PrismaService } from '../../database/prisma/prisma.service';

class UpdateProjectShowcaseDto {
  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LIMITS.technicalDescription, { message: `A descrição técnica deve ter no máximo ${PROJECT_LIMITS.technicalDescription} caracteres` })
  technicalDescription?: string | null;
}

class UpdateProjectDemandDto {
  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LIMITS.demandDescription, { message: `A descrição da demanda deve ter no máximo ${PROJECT_LIMITS.demandDescription} caracteres` })
  demandDescription?: string | null;
}

class CreateProjectShowcaseAttachmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  size!: number;

  @IsString()
  @IsNotEmpty()
  dataUrl!: string;
}

class CreateProjectDemandAttachmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  size!: number;

  @IsString()
  @IsNotEmpty()
  dataUrl!: string;
}

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectsController {
  constructor(
    private readonly listProjectsUseCase: ListProjectsUseCase,
    private readonly getProjectByIdUseCase: GetProjectByIdUseCase,
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
    private readonly getQueuedProjectsUseCase: GetQueuedProjectsUseCase,
    private readonly reorderQueueUseCase: ReorderQueueUseCase,
    private readonly addDeveloperUseCase: AddDeveloperUseCase,
    private readonly removeDeveloperUseCase: RemoveDeveloperUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @RequirePermission('projects:read')
  async listAll(): Promise<ProjectResponse[]> {
    const projects = await this.listProjectsUseCase.execute();
    return projects.map(ProjectPresenter.toHTTP);
  }

  @Get('queued')
  @RequirePermission('projects:read')
  async getQueued(): Promise<ProjectResponse[]> {
    const projects = await this.getQueuedProjectsUseCase.execute();
    return projects.map(ProjectPresenter.toHTTP);
  }

  @Get(':id')
  @RequirePermission('projects:read')
  async getById(@Param('id') id: string): Promise<ProjectResponse> {
    const project = await this.getProjectByIdUseCase.execute(id);
    return ProjectPresenter.toHTTP(project);
  }

  @Post()
  @RequirePermission('projects:create')
  async create(
    @Body() body: CreateProjectDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ProjectResponse> {
    const project = await this.createProjectUseCase.execute({
      companyId: body.companyId,
      name: body.name,
      description: body.description,
      technicalDescription: body.technicalDescription,
      requestedBy: body.requestedBy,
      ownerId: body.ownerId || request.userId,
      status: body.status,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : null,
      estimatedHours: body.estimatedHours,
      color: body.color,
      testUrl: body.testUrl,
      avatar: body.avatar,
    });
    return ProjectPresenter.toHTTP(project);
  }

  // Sem @RequirePermission: a autorização (admin OU dono) é feita no use-case,
  // para o dono poder editar o próprio projeto mesmo sem `projects:update`.
  @Put(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
  ): Promise<ProjectResponse> {
    const project = await this.updateProjectUseCase.execute({
      id,
      requesterId: req.userId,
      requesterRole: req.userRole,
      companyId: body.companyId !== undefined ? (body.companyId || null) : undefined,
      name: body.name,
      description: body.description,
      technicalDescription: body.technicalDescription,
      requestedBy: body.requestedBy,
      status: body.status,
      ownerId: body.ownerId,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate !== undefined ? (body.endDate ? new Date(body.endDate) : null) : undefined,
      estimatedHours: body.estimatedHours,
      color: body.color,
      testUrl: body.testUrl,
      progress: body.progress,
    });
    return ProjectPresenter.toHTTP(project);
  }

  @Put(':id/showcase')
  @RequirePermission('projects:update')
  async updateShowcase(
    @Param('id') id: string,
    @Body() body: UpdateProjectShowcaseDto,
  ): Promise<ProjectResponse> {
    const project = await this.updateProjectUseCase.execute({
      id,
      technicalDescription: body.technicalDescription ?? null,
    });
    return ProjectPresenter.toHTTP(project);
  }

  @Put(':id/demand')
  @RequirePermission('projects:update')
  async updateDemand(
    @Param('id') id: string,
    @Body() body: UpdateProjectDemandDto,
  ): Promise<ProjectResponse> {
    const project = await this.updateProjectUseCase.execute({
      id,
      demandDescription: body.demandDescription ?? null,
    });
    return ProjectPresenter.toHTTP(project);
  }

  @Get(':id/showcase-attachments')
  @RequirePermission('projects:read')
  async getShowcaseAttachments(@Param('id') id: string) {
    const attachments = await this.prisma.projectShowcaseAttachment.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });
    return { attachments };
  }

  @Post(':id/showcase-attachments')
  @RequirePermission('projects:update')
  async createShowcaseAttachment(
    @Param('id') id: string,
    @Body() body: CreateProjectShowcaseAttachmentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const attachment = await this.prisma.projectShowcaseAttachment.create({
      data: {
        projectId: id,
        userId: request.userId,
        name: body.name,
        type: body.type,
        size: body.size,
        dataUrl: body.dataUrl,
      },
    });
    return { attachment };
  }

  @Delete('showcase-attachments/:id')
  @HttpCode(204)
  @RequirePermission('projects:update')
  async deleteShowcaseAttachment(@Param('id') id: string): Promise<void> {
    // Soft delete (recuperável na Lixeira).
    await this.prisma.projectShowcaseAttachment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  @Get(':id/demand-attachments')
  @RequirePermission('projects:read')
  async getDemandAttachments(@Param('id') id: string) {
    const attachments = await this.prisma.projectDemandAttachment.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });
    return { attachments };
  }

  @Post(':id/demand-attachments')
  @RequirePermission('projects:update')
  async createDemandAttachment(
    @Param('id') id: string,
    @Body() body: CreateProjectDemandAttachmentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const attachment = await this.prisma.projectDemandAttachment.create({
      data: {
        projectId: id,
        userId: request.userId,
        name: body.name,
        type: body.type,
        size: body.size,
        dataUrl: body.dataUrl,
      },
    });
    return { attachment };
  }

  @Delete('demand-attachments/:id')
  @HttpCode(204)
  @RequirePermission('projects:update')
  async deleteDemandAttachment(@Param('id') id: string): Promise<void> {
    // Soft delete (recuperável na Lixeira).
    await this.prisma.projectDemandAttachment.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // Sem @RequirePermission: a autorização (admin OU dono) é feita no use-case,
  // para o dono poder excluir o próprio projeto mesmo sem `projects:delete`.
  @Delete(':id')
  async delete(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    await this.deleteProjectUseCase.execute(id, req.userId, req.userRole);
    return { success: true };
  }

  @Post('queue/reorder')
  @RequirePermission('projects:update')
  async reorderQueue(@Body() body: ReorderQueueDto): Promise<{ success: boolean }> {
    await this.reorderQueueUseCase.execute(body.orderedIds);
    return { success: true };
  }

  @Post(':id/developers/:userId')
  @RequirePermission('projects:update')
  async addDeveloper(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<{ success: boolean }> {
    await this.addDeveloperUseCase.execute(id, userId);
    return { success: true };
  }

  @Delete(':id/developers/:userId')
  @RequirePermission('projects:update')
  async removeDeveloper(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ): Promise<{ success: boolean }> {
    await this.removeDeveloperUseCase.execute(id, userId);
    return { success: true };
  }
}
