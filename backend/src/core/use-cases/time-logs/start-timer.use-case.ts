import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import type { ITimeLogRepository } from '../../domain/repositories/time-log-repository.interface';
import { ITimeLogRepositoryToken } from '../../domain/repositories/time-log-repository.interface';
import { TimeLog } from '../../domain/entities/time-log.entity';
import { TimeLogSource, TaskStatus } from '../../domain/entities/enums';

export interface StartTimerInput {
  projectId: string;
  taskId: string;
  userId: string;
  status?: TaskStatus;
}

@Injectable()
export class StartTimerUseCase {
  constructor(
    @Inject(ITimeLogRepositoryToken)
    private readonly timeLogRepository: ITimeLogRepository,
  ) {}

  async execute(input: StartTimerInput): Promise<TimeLog> {
    const active = await this.timeLogRepository.findActiveSessionByUserId(input.userId);
    if (active) {
      throw new BadRequestException('Você já possui um cronômetro ativo. Pause-o antes de iniciar outro.');
    }

    const timeLog = new TimeLog({
      projectId: input.projectId,
      taskId: input.taskId,
      userId: input.userId,
      hours: 0.01, // Valor mínimo inicial para passar na validação de horas > 0
      description: 'Timer ativo',
      date: new Date(),
      startedAt: new Date(),
      source: TimeLogSource.TIMER,
      status: input.status ?? TaskStatus.EM_DESENVOLVIMENTO,
    });

    return this.timeLogRepository.create(timeLog);
  }
}
