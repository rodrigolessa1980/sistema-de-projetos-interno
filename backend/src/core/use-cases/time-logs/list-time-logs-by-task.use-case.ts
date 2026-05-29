import { Inject, Injectable } from '@nestjs/common';
import type { ITimeLogRepository } from '../../domain/repositories/time-log-repository.interface';
import { ITimeLogRepositoryToken } from '../../domain/repositories/time-log-repository.interface';
import { TimeLog } from '../../domain/entities/time-log.entity';

@Injectable()
export class ListTimeLogsByTaskUseCase {
  constructor(
    @Inject(ITimeLogRepositoryToken)
    private readonly timeLogRepository: ITimeLogRepository,
  ) {}

  async execute(taskId: string): Promise<TimeLog[]> {
    return this.timeLogRepository.findByTaskId(taskId);
  }
}
