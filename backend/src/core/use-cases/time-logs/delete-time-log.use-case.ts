import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITimeLogRepository } from '../../domain/repositories/time-log-repository.interface';
import { ITimeLogRepositoryToken } from '../../domain/repositories/time-log-repository.interface';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';

@Injectable()
export class DeleteTimeLogUseCase {
  constructor(
    @Inject(ITimeLogRepositoryToken)
    private readonly timeLogRepository: ITimeLogRepository,
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.timeLogRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Log de tempo não encontrado.');
    }

    const { taskId, projectId, endedAt } = existing;
    await this.timeLogRepository.delete(id);

    // Só recalcula se era um log finalizado (não uma sessão ativa cancelada)
    if (endedAt !== null) {
      const [taskHours, projectHours] = await Promise.all([
        this.timeLogRepository.sumFinalizedHoursByTaskId(taskId),
        this.timeLogRepository.sumFinalizedHoursByProjectId(projectId),
      ]);
      await Promise.all([
        this.taskRepository.updateActualHours(taskId, taskHours),
        this.projectRepository.updateActualHours(projectId, projectHours),
      ]);
    }
  }
}
