import { Comment } from '../entities/comment.entity';

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  findById(id: string): Promise<Comment | null>;
  updateContent(id: string, content: string): Promise<Comment>;
  /** Soft delete: marca deletedAt (o comentário continua visível como "apagado"). */
  softDelete(id: string): Promise<Comment>;
}

export const ICommentRepositoryToken = Symbol('ICommentRepository');
