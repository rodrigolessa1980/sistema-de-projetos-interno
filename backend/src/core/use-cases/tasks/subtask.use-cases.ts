import { Inject, Injectable } from '@nestjs/common';
import { Subtask } from '../../domain/entities/subtask.entity';
import type {
  ISubtaskRepository,
  UpdateSubtaskFields,
} from '../../domain/repositories/subtask-repository.interface';
import { ISubtaskRepositoryToken } from '../../domain/repositories/subtask-repository.interface';

export interface CreateSubtaskInput {
  taskId: string;
  title: string;
  assigneeId?: string | null;
}

@Injectable()
export class CreateSubtaskUseCase {
  constructor(
    @Inject(ISubtaskRepositoryToken)
    private readonly subtaskRepository: ISubtaskRepository,
  ) {}

  async execute(input: CreateSubtaskInput): Promise<Subtask> {
    const title = input.title.trim();
    if (!title) throw new Error('A subtarefa precisa de um título');
    return this.subtaskRepository.create(
      new Subtask({ taskId: input.taskId, title, assigneeId: input.assigneeId ?? null }),
    );
  }
}

@Injectable()
export class UpdateSubtaskUseCase {
  constructor(
    @Inject(ISubtaskRepositoryToken)
    private readonly subtaskRepository: ISubtaskRepository,
  ) {}

  async execute(id: string, fields: UpdateSubtaskFields): Promise<Subtask> {
    return this.subtaskRepository.update(id, fields);
  }
}

@Injectable()
export class DeleteSubtaskUseCase {
  constructor(
    @Inject(ISubtaskRepositoryToken)
    private readonly subtaskRepository: ISubtaskRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.subtaskRepository.delete(id);
  }
}
