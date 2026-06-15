import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, type AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { CreateApiTokenDto } from '../dtos/api-tokens/create-api-token.dto';
import { CreateApiTokenUseCase } from '../../../core/use-cases/api-tokens/create-api-token.use-case';
import {
  ListApiTokensUseCase,
  RevokeApiTokenUseCase,
} from '../../../core/use-cases/api-tokens/manage-api-tokens.use-case';
import { UserRole } from '../../../core/domain/entities/enums';
import { ALL_PERMISSIONS } from '../../../core/permissions/permission-keys';

@Controller('api-tokens')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ApiTokensController {
  constructor(
    private readonly createApiTokenUseCase: CreateApiTokenUseCase,
    private readonly listApiTokensUseCase: ListApiTokensUseCase,
    private readonly revokeApiTokenUseCase: RevokeApiTokenUseCase,
  ) {}

  @Get()
  async listMine(@Req() req: AuthenticatedRequest) {
    return {
      tokens: await this.listApiTokensUseCase.execute(req.userId),
    };
  }

  @Get('available-scopes')
  async listAvailableScopes(@Req() req: AuthenticatedRequest) {
    const scopes = req.userRole === UserRole.ADMIN
      ? ALL_PERMISSIONS
      : [...req.permissions];
    return { scopes: scopes.sort() };
  }

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() body: CreateApiTokenDto) {
    try {
      const result = await this.createApiTokenUseCase.execute({
        userId: req.userId,
        userRole: req.userRole,
        name: body.name,
        scopes: body.scopes,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      });
      return result;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Escopos')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':id')
  async revoke(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.revokeApiTokenUseCase.execute(
      id,
      req.userId,
      req.userRole === UserRole.ADMIN,
    );
    return { success: true };
  }
}
