import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import type { ITimeLogRepository } from '../../domain/repositories/time-log-repository.interface';
import { ITimeLogRepositoryToken } from '../../domain/repositories/time-log-repository.interface';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';
import { TimeLog } from '../../domain/entities/time-log.entity';
import { TimeLogSource } from '../../domain/entities/enums';

export interface StopTimerInput {
  userId: string;
  description: string;
}

@Injectable()
export class StopTimerUseCase {
  constructor(
    @Inject(ITimeLogRepositoryToken)
    private readonly timeLogRepository: ITimeLogRepository,
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(input: StopTimerInput): Promise<TimeLog> {
    const active = await this.timeLogRepository.findActiveSessionByUserId(input.userId);
    if (!active) {
      throw new BadRequestException('Nenhum cronômetro ativo encontrado para este usuário.');
    }

    if (!input.description || input.description.trim().length === 0) {
      throw new BadRequestException('A descrição do log de tempo é obrigatória.');
    }

    const now = new Date();
    const startedAt = active.startedAt || active.createdAt || new Date();
    const durationSeconds = Math.max(1, Math.floor((now.getTime() - startedAt.getTime()) / 1000));
    const hours = Math.max(0.01, Number((durationSeconds / 3600).toFixed(4)));

    // Removemos a sessão temporária ativa
    await this.timeLogRepository.delete(active.id);

    // Criamos o log de tempo finalizado e persistido
    const finalizedTimeLog = new TimeLog({
      projectId: active.projectId,
      taskId: active.taskId,
      userId: active.userId,
      hours,
      durationSeconds,
      description: input.description,
      date: new Date(),
      startedAt,
      endedAt: now,
      source: TimeLogSource.TIMER,
      status: active.status,
    });

    const finalized = await this.timeLogRepository.create(finalizedTimeLog);

    const [taskHours, projectHours] = await Promise.all([
      this.timeLogRepository.sumFinalizedHoursByTaskId(active.taskId),
      this.timeLogRepository.sumFinalizedHoursByProjectId(active.projectId),
    ]);
    await Promise.all([
      this.taskRepository.updateActualHours(active.taskId, taskHours),
      this.projectRepository.updateActualHours(active.projectId, projectHours),
    ]);

    return finalized;
  }
}
