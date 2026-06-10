import { Inject, Injectable } from '@nestjs/common';
import type { ITimeLogRepository } from '../../domain/repositories/time-log-repository.interface';
import { ITimeLogRepositoryToken } from '../../domain/repositories/time-log-repository.interface';
import { TimeLog } from '../../domain/entities/time-log.entity';

@Injectable()
export class ListTimeLogsByProjectUseCase {
  constructor(
    @Inject(ITimeLogRepositoryToken)
    private readonly timeLogRepository: ITimeLogRepository,
  ) {}

  async execute(projectId: string): Promise<TimeLog[]> {
    const all = await this.timeLogRepository.findByProjectId(projectId);
    return all.filter((log) => log.endedAt !== null);
  }
}
