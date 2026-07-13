import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ITaskRepository } from '../../domain/repositories/task-repository.interface';
import { ITaskRepositoryToken } from '../../domain/repositories/task-repository.interface';
import { UserRole } from '../../domain/entities/enums';
import { ReleaseUrgencyBlocksUseCase } from './release-urgency-blocks.use-case';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(ITaskRepositoryToken)
    private readonly taskRepository: ITaskRepository,
    private readonly releaseUrgencyBlocksUseCase: ReleaseUrgencyBlocksUseCase,
  ) {}

  async execute(id: string, requesterId: string, requesterRole: UserRole): Promise<void> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    // Só o admin ou o autor (reporter) da tarefa pode excluí-la.
    if (requesterRole !== UserRole.ADMIN && existing.reporterId !== requesterId) {
      throw new ForbiddenException('Você só pode excluir tarefas que você criou.');
    }

    await this.releaseUrgencyBlocksUseCase.execute(existing.id);
    await this.taskRepository.delete(id);
  }
}
