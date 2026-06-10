import { Inject, Injectable } from '@nestjs/common';
import type { ITimeLogRepository } from '../../domain/repositories/time-log-repository.interface';
import { ITimeLogRepositoryToken } from '../../domain/repositories/time-log-repository.interface';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';
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
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(input: CreateTimeLogInput): Promise<TimeLog> {
    const timeLog = new TimeLog({
      projectId: input.projectId,
      taskId: input.taskId,
      userId: input.userId,
      hours: input.hours,
      description: input.description,
      date: input.date,
      startedAt: null,
      endedAt: new Date(),
      source: input.source ?? TimeLogSource.MANUAL,
      status: input.status,
    });

    const created = await this.timeLogRepository.create(timeLog);

    const [taskHours, projectHours] = await Promise.all([
      this.timeLogRepository.sumFinalizedHoursByTaskId(input.taskId),
      this.timeLogRepository.sumFinalizedHoursByProjectId(input.projectId),
    ]);
    await Promise.all([
      this.taskRepository.updateActualHours(input.taskId, taskHours),
      this.projectRepository.updateActualHours(input.projectId, projectHours),
    ]);

    return created;
  }
}
