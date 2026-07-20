import { Inject, Injectable } from '@nestjs/common';
import { TaskNote } from '../../domain/entities/task-note.entity';
import type {
  ITaskNoteRepository,
  UpdateTaskNoteFields,
} from '../../domain/repositories/task-note-repository.interface';
import { ITaskNoteRepositoryToken } from '../../domain/repositories/task-note-repository.interface';

export interface CreateTaskNoteInput {
  taskId: string;
  userId: string;
  content: string;
}

@Injectable()
export class CreateTaskNoteUseCase {
  constructor(
    @Inject(ITaskNoteRepositoryToken)
    private readonly noteRepository: ITaskNoteRepository,
  ) {}

  async execute(input: CreateTaskNoteInput): Promise<TaskNote> {
    const content = input.content.trim();
    if (!content) throw new Error('A anotação não pode ser vazia');
    return this.noteRepository.create(
      new TaskNote({ taskId: input.taskId, userId: input.userId, content }),
    );
  }
}

@Injectable()
export class UpdateTaskNoteUseCase {
  constructor(
    @Inject(ITaskNoteRepositoryToken)
    private readonly noteRepository: ITaskNoteRepository,
  ) {}

  async execute(id: string, fields: UpdateTaskNoteFields): Promise<TaskNote> {
    return this.noteRepository.update(id, fields);
  }
}

@Injectable()
export class DeleteTaskNoteUseCase {
  constructor(
    @Inject(ITaskNoteRepositoryToken)
    private readonly noteRepository: ITaskNoteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.noteRepository.delete(id);
  }
}
