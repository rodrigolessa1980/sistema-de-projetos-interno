import { ApiToken } from '../entities/api-token.entity';

export const IApiTokenRepositoryToken = 'IApiTokenRepository';

export interface CreateApiTokenRecordInput {
  userId: string;
  name: string;
  tokenHash: string;
  tokenPrefix: string;
  scopes: string[];
  expiresAt?: Date | null;
}

export interface IApiTokenRepository {
  create(input: CreateApiTokenRecordInput): Promise<ApiToken>;
  findByHash(tokenHash: string): Promise<ApiToken | null>;
  listByUserId(userId: string): Promise<ApiToken[]>;
  findById(id: string): Promise<ApiToken | null>;
  markUsed(id: string): Promise<void>;
  revoke(id: string): Promise<void>;
}
