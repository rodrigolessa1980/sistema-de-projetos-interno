import { TaskNote } from '../entities/task-note.entity';

export interface UpdateTaskNoteFields {
  content?: string;
  isPinned?: boolean;
}

export interface ITaskNoteRepository {
  create(note: TaskNote): Promise<TaskNote>;
  update(id: string, fields: UpdateTaskNoteFields): Promise<TaskNote>;
  delete(id: string): Promise<void>;
}

export const ITaskNoteRepositoryToken = Symbol('ITaskNoteRepository');
