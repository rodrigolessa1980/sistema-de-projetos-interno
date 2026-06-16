import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import type { IApiTokenRepository } from '../../domain/repositories/api-token-repository.interface';
import { IApiTokenRepositoryToken } from '../../domain/repositories/api-token-repository.interface';
import { UserRole } from '../../domain/entities/enums';
import { PermissionService } from '../../permissions/permission.service';
import {
  extractApiTokenPrefix,
  generateApiTokenValue,
  hashApiToken,
} from '../../permissions/api-token.util';

export interface CreateApiTokenInput {
  userId: string;
  userRole: UserRole;
  name: string;
  scopes?: string[];
  expiresAt?: Date | null;
}

export interface CreateApiTokenResult {
  id: string;
  name: string;
  tokenPrefix: string;
  scopes: string[];
  expiresAt: string | null;
  createdAt: string;
  token: string;
}

@Injectable()
export class CreateApiTokenUseCase {
  constructor(
    @Inject(IApiTokenRepositoryToken)
    private readonly apiTokenRepository: IApiTokenRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async execute(input: CreateApiTokenInput): Promise<CreateApiTokenResult> {
    const name = input.name.trim();
    if (!name) {
      throw new BadRequestException('Nome do token é obrigatório.');
    }

    const userPermissions = await this.permissionService.getUserPermissionSet(
      input.userId,
      input.userRole,
    );

    const requestedScopes = input.scopes?.filter(Boolean) ?? [];
    const scopes = requestedScopes.length > 0
      ? this.permissionService.validateScopesSubset(userPermissions, requestedScopes)
      : [...userPermissions];

    const plainToken = generateApiTokenValue();
    const record = await this.apiTokenRepository.create({
      userId: input.userId,
      name,
      tokenHash: hashApiToken(plainToken),
      tokenPrefix: extractApiTokenPrefix(plainToken),
      scopes,
      expiresAt: input.expiresAt ?? null,
    });

    return {
      id: record.id,
      name: record.name,
      tokenPrefix: record.tokenPrefix,
      scopes: record.scopes,
      expiresAt: record.expiresAt?.toISOString() ?? null,
      createdAt: record.createdAt.toISOString(),
      token: plainToken,
    };
  }
}
