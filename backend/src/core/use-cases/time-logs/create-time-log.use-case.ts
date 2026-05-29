import { Inject, Injectable } from '@nestjs/common';
import type { ITimeLogRepository } from '../../domain/repositories/time-log-repository.interface';
import { ITimeLogRepositoryToken } from '../../domain/repositories/time-log-repository.interface';
import { TimeLog } from '../../domain/entities/time-log.entity';
import { TimeLogSource, TaskStatus } from '../../domain/entities/enums';

export interface CreateTimeLogInput {
  projectId: string;
  taskId: string;
  userId: string;
  hours: number;
  description: string;
  date: Date;
  source?: TimeLogSource;
  status: TaskStatus;
}

@Injectable()
export class CreateTimeLogUseCase {
  constructor(
    @Inject(ITimeLogRepositoryToken)
    private readonly timeLogRepository: ITimeLogRepository,
  ) {}

  async execute(input: CreateTimeLogInput): Promise<TimeLog> {
    const timeLog = new TimeLog({
      projectId: input.projectId,
      taskId: input.taskId,
      userId: input.userId,
      hours: input.hours,
      description: input.description,
      date: input.date,
      source: input.source ?? TimeLogSource.MANUAL,
      status: input.status,
    });

    return this.timeLogRepository.create(timeLog);
  }
}
