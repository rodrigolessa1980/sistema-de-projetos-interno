import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { IApiTokenRepository } from '../../domain/repositories/api-token-repository.interface';
import { IApiTokenRepositoryToken } from '../../domain/repositories/api-token-repository.interface';

@Injectable()
export class ListApiTokensUseCase {
  constructor(
    @Inject(IApiTokenRepositoryToken)
    private readonly apiTokenRepository: IApiTokenRepository,
  ) {}

  async execute(userId: string) {
    const tokens = await this.apiTokenRepository.listByUserId(userId);
    return tokens.map((token) => ({
      id: token.id,
      name: token.name,
      tokenPrefix: token.tokenPrefix,
      scopes: token.scopes,
      expiresAt: token.expiresAt?.toISOString() ?? null,
      lastUsedAt: token.lastUsedAt?.toISOString() ?? null,
      revokedAt: token.revokedAt?.toISOString() ?? null,
      createdAt: token.createdAt.toISOString(),
      isActive: token.isActive(),
    }));
  }
}

@Injectable()
export class RevokeApiTokenUseCase {
  constructor(
    @Inject(IApiTokenRepositoryToken)
    private readonly apiTokenRepository: IApiTokenRepository,
  ) {}

  async execute(tokenId: string, userId: string, isAdmin: boolean): Promise<void> {
    const token = await this.apiTokenRepository.findById(tokenId);
    if (!token) {
      throw new NotFoundException('Token não encontrado.');
    }
    if (token.userId !== userId && !isAdmin) {
      throw new ForbiddenException('Você não pode revogar tokens de outro usuário.');
    }
    await this.apiTokenRepository.revoke(tokenId);
  }
}
