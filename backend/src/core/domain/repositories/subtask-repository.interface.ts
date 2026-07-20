import { Subtask } from '../entities/subtask.entity';

export interface UpdateSubtaskFields {
  title?: string;
  completed?: boolean;
  assigneeId?: string | null;
}

export interface ISubtaskRepository {
  create(subtask: Subtask): Promise<Subtask>;
  update(id: string, fields: UpdateSubtaskFields): Promise<Subtask>;
  delete(id: string): Promise<void>;
}

export const ISubtaskRepositoryToken = Symbol('ISubtaskRepository');
