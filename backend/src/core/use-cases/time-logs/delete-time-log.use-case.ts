import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITimeLogRepository } from '../../domain/repositories/time-log-repository.interface';
import { ITimeLogRepositoryToken } from '../../domain/repositories/time-log-repository.interface';

@Injectable()
export class DeleteTimeLogUseCase {
  constructor(
    @Inject(ITimeLogRepositoryToken)
    private readonly timeLogRepository: ITimeLogRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.timeLogRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Log de tempo não encontrado.');
    }
    await this.timeLogRepository.delete(id);
  }
}
