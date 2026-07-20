import { Comment } from '../entities/comment.entity';

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  delete(id: string): Promise<void>;
}

export const ICommentRepositoryToken = Symbol('ICommentRepository');
