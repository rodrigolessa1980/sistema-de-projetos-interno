import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateApiTokenRecordInput,
  IApiTokenRepository,
} from '../../../core/domain/repositories/api-token-repository.interface';
import { ApiToken } from '../../../core/domain/entities/api-token.entity';

@Injectable()
export class PrismaApiTokenRepository implements IApiTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(raw: {
    id: string;
    userId: string;
    name: string;
    tokenHash: string;
    tokenPrefix: string;
    scopes: unknown;
    expiresAt: Date | null;
    lastUsedAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
  }): ApiToken {
    const scopes = Array.isArray(raw.scopes)
      ? raw.scopes.filter((scope): scope is string => typeof scope === 'string')
      : [];

    return new ApiToken({
      id: raw.id,
      userId: raw.userId,
      name: raw.name,
      tokenHash: raw.tokenHash,
      tokenPrefix: raw.tokenPrefix,
      scopes,
      expiresAt: raw.expiresAt,
      lastUsedAt: raw.lastUsedAt,
      revokedAt: raw.revokedAt,
      createdAt: raw.createdAt,
    });
  }

  async create(input: CreateApiTokenRecordInput): Promise<ApiToken> {
    const raw = await this.prisma.apiToken.create({
      data: {
        userId: input.userId,
        name: input.name,
        tokenHash: input.tokenHash,
        tokenPrefix: input.tokenPrefix,
        scopes: input.scopes,
        expiresAt: input.expiresAt ?? null,
      },
    });
    return this.mapToDomain(raw);
  }

  async findByHash(tokenHash: string): Promise<ApiToken | null> {
    const raw = await this.prisma.apiToken.findUnique({ where: { tokenHash } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async listByUserId(userId: string): Promise<ApiToken[]> {
    const raws = await this.prisma.apiToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async findById(id: string): Promise<ApiToken | null> {
    const raw = await this.prisma.apiToken.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async markUsed(id: string): Promise<void> {
    await this.prisma.apiToken.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.apiToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
