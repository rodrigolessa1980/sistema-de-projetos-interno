import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, type AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermission } from '../decorators/require-permission.decorator';
import { CreateTimeLogUseCase } from '../../../core/use-cases/time-logs/create-time-log.use-case';
import { StartTimerUseCase } from '../../../core/use-cases/time-logs/start-timer.use-case';
import { StopTimerUseCase } from '../../../core/use-cases/time-logs/stop-timer.use-case';
import { GetActiveSessionUseCase } from '../../../core/use-cases/time-logs/get-active-session.use-case';
import { ListTimeLogsByTaskUseCase } from '../../../core/use-cases/time-logs/list-time-logs-by-task.use-case';
import { ListTimeLogsByUserUseCase } from '../../../core/use-cases/time-logs/list-time-logs-by-user.use-case';
import { ListTimeLogsByProjectUseCase } from '../../../core/use-cases/time-logs/list-time-logs-by-project.use-case';
import { ListAllTimeLogsUseCase } from '../../../core/use-cases/time-logs/list-all-time-logs.use-case';
import { DeleteTimeLogUseCase } from '../../../core/use-cases/time-logs/delete-time-log.use-case';
import { CreateTimeLogDto } from '../dtos/time-logs/create-time-log.dto';
import { StartTimerDto } from '../dtos/time-logs/start-timer.dto';
import { StopTimerDto } from '../dtos/time-logs/stop-timer.dto';
import { TimeLogPresenter, TimeLogResponse } from '../presenters/time-log.presenter';
import { UserRole } from '../../../core/domain/entities/enums';

@Controller('time-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TimeLogsController {
  constructor(
    private readonly createTimeLogUseCase: CreateTimeLogUseCase,
    private readonly startTimerUseCase: StartTimerUseCase,
    private readonly stopTimerUseCase: StopTimerUseCase,
    private readonly getActiveSessionUseCase: GetActiveSessionUseCase,
    private readonly listTimeLogsByTaskUseCase: ListTimeLogsByTaskUseCase,
    private readonly listTimeLogsByUserUseCase: ListTimeLogsByUserUseCase,
    private readonly listTimeLogsByProjectUseCase: ListTimeLogsByProjectUseCase,
    private readonly listAllTimeLogsUseCase: ListAllTimeLogsUseCase,
    private readonly deleteTimeLogUseCase: DeleteTimeLogUseCase,
  ) {}

  @Get()
  @RequirePermission('timelogs:read')
  async listAll(@Req() req: AuthenticatedRequest): Promise<TimeLogResponse[]> {
    // Admin enxerga todos os registros; demais usuários, apenas os próprios.
    const logs = req.userRole === UserRole.ADMIN
      ? await this.listAllTimeLogsUseCase.execute()
      : await this.listTimeLogsByUserUseCase.execute(req.userId);
    return logs.map(TimeLogPresenter.toHTTP);
  }

  @Post()
  @RequirePermission('timelogs:create')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateTimeLogDto,
  ): Promise<TimeLogResponse> {
    const timeLog = await this.createTimeLogUseCase.execute({
      projectId: body.projectId,
      taskId: body.taskId,
      userId: req.userId,
      hours: body.hours,
      description: body.description,
      date: new Date(body.date),
      source: body.source,
      status: body.status,
    });
    return TimeLogPresenter.toHTTP(timeLog);
  }

  @Get('me')
  @RequirePermission('timelogs:read')
  async listMine(@Req() req: AuthenticatedRequest): Promise<TimeLogResponse[]> {
    const logs = await this.listTimeLogsByUserUseCase.execute(req.userId);
    return logs.map(TimeLogPresenter.toHTTP);
  }

  @Get('tracker/active')
  @RequirePermission('timelogs:read')
  async getActive(@Req() req: AuthenticatedRequest): Promise<TimeLogResponse | null> {
    const log = await this.getActiveSessionUseCase.execute(req.userId);
    return log ? TimeLogPresenter.toHTTP(log) : null;
  }

  @Post('tracker/start')
  @RequirePermission('timelogs:create')
  async startTimer(
    @Req() req: AuthenticatedRequest,
    @Body() body: StartTimerDto,
  ): Promise<TimeLogResponse> {
    const log = await this.startTimerUseCase.execute({
      projectId: body.projectId,
      taskId: body.taskId,
      userId: req.userId,
      status: body.status,
    });
    return TimeLogPresenter.toHTTP(log);
  }

  @Post('tracker/stop')
  @RequirePermission('timelogs:create')
  async stopTimer(
    @Req() req: AuthenticatedRequest,
    @Body() body: StopTimerDto,
  ): Promise<TimeLogResponse> {
    const log = await this.stopTimerUseCase.execute({
      userId: req.userId,
      description: body.description,
    });
    return TimeLogPresenter.toHTTP(log);
  }

  @Get('task/:taskId')
  @RequirePermission('timelogs:read')
  async listByTask(@Param('taskId') taskId: string): Promise<TimeLogResponse[]> {
    const logs = await this.listTimeLogsByTaskUseCase.execute(taskId);
    return logs.map(TimeLogPresenter.toHTTP);
  }

  @Get('user/:userId')
  @RequirePermission('timelogs:read')
  async listByUser(
    @Req() req: AuthenticatedRequest,
    @Param('userId') userId: string,
  ): Promise<TimeLogResponse[]> {
    if (
      userId !== req.userId &&
      req.userRole !== UserRole.ADMIN &&
      !req.permissions.has('users:read')
    ) {
      throw new ForbiddenException('Você só pode listar seus próprios registros de horas.');
    }
    const logs = await this.listTimeLogsByUserUseCase.execute(userId);
    return logs.map(TimeLogPresenter.toHTTP);
  }

  @Get('project/:projectId')
  @RequirePermission('timelogs:read')
  async listByProject(@Param('projectId') projectId: string): Promise<TimeLogResponse[]> {
    const logs = await this.listTimeLogsByProjectUseCase.execute(projectId);
    return logs.map(TimeLogPresenter.toHTTP);
  }

  @Delete(':id')
  @RequirePermission('timelogs:delete')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.deleteTimeLogUseCase.execute(id);
    return { success: true };
  }
}
