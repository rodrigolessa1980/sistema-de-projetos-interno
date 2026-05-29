import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { CreateTimeLogUseCase } from '../../../core/use-cases/time-logs/create-time-log.use-case';
import { StartTimerUseCase } from '../../../core/use-cases/time-logs/start-timer.use-case';
import { StopTimerUseCase } from '../../../core/use-cases/time-logs/stop-timer.use-case';
import { GetActiveSessionUseCase } from '../../../core/use-cases/time-logs/get-active-session.use-case';
import { ListTimeLogsByTaskUseCase } from '../../../core/use-cases/time-logs/list-time-logs-by-task.use-case';
import { ListTimeLogsByUserUseCase } from '../../../core/use-cases/time-logs/list-time-logs-by-user.use-case';
import { DeleteTimeLogUseCase } from '../../../core/use-cases/time-logs/delete-time-log.use-case';
import { CreateTimeLogDto } from '../dtos/time-logs/create-time-log.dto';
import { StartTimerDto } from '../dtos/time-logs/start-timer.dto';
import { StopTimerDto } from '../dtos/time-logs/stop-timer.dto';
import { TimeLogPresenter, TimeLogResponse } from '../presenters/time-log.presenter';

@Controller('time-logs')
@UseGuards(JwtAuthGuard)
export class TimeLogsController {
  constructor(
    private readonly createTimeLogUseCase: CreateTimeLogUseCase,
    private readonly startTimerUseCase: StartTimerUseCase,
    private readonly stopTimerUseCase: StopTimerUseCase,
    private readonly getActiveSessionUseCase: GetActiveSessionUseCase,
    private readonly listTimeLogsByTaskUseCase: ListTimeLogsByTaskUseCase,
    private readonly listTimeLogsByUserUseCase: ListTimeLogsByUserUseCase,
    private readonly deleteTimeLogUseCase: DeleteTimeLogUseCase,
  ) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateTimeLogDto,
  ): Promise<TimeLogResponse> {
    const timeLog = await this.createTimeLogUseCase.execute({
      projectId: body.projectId,
      taskId: body.taskId,
      userId: req.userId, // Usa o usuário logado
      hours: body.hours,
      description: body.description,
      date: new Date(body.date),
      source: body.source,
      status: body.status,
    });
    return TimeLogPresenter.toHTTP(timeLog);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.deleteTimeLogUseCase.execute(id);
    return { success: true };
  }

  @Get('task/:taskId')
  async listByTask(@Param('taskId') taskId: string): Promise<TimeLogResponse[]> {
    const logs = await this.listTimeLogsByTaskUseCase.execute(taskId);
    return logs.map(TimeLogPresenter.toHTTP);
  }

  @Get('user/:userId')
  async listByUser(@Param('userId') userId: string): Promise<TimeLogResponse[]> {
    const logs = await this.listTimeLogsByUserUseCase.execute(userId);
    return logs.map(TimeLogPresenter.toHTTP);
  }

  @Get('tracker/active')
  async getActive(@Req() req: AuthenticatedRequest): Promise<TimeLogResponse | null> {
    const log = await this.getActiveSessionUseCase.execute(req.userId);
    return log ? TimeLogPresenter.toHTTP(log) : null;
  }

  @Post('tracker/start')
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
}
