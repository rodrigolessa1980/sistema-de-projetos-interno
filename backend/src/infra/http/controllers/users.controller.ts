import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ListUsersUseCase } from '../../../core/use-cases/users/list-users.use-case';
import { GetUserPermissionsUseCase } from '../../../core/use-cases/users/get-user-permissions.use-case';
import { UpdateUserPermissionsUseCase } from '../../../core/use-cases/users/update-user-permissions.use-case';
import { UpdatePermissionsDto } from '../dtos/users/update-permissions.dto';
import { UserPresenter } from '../presenters/user.presenter';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase,
    private readonly updateUserPermissionsUseCase: UpdateUserPermissionsUseCase,
  ) {}

  @Get()
  async listUsers() {
    const result = await this.listUsersUseCase.execute();
    return result.map(({ user, permissions }) => ({
      ...UserPresenter.toHTTP(user),
      permissionCount: permissions.filter((p) => p.granted).length,
      permissions: permissions.map((p) => ({
        module: p.module,
        action: p.action,
        granted: p.granted,
      })),
    }));
  }

  @Get(':id/permissions')
  async getPermissions(@Param('id') id: string) {
    const permissions = await this.getUserPermissionsUseCase.execute(id);
    return permissions.map((p) => ({
      module: p.module,
      action: p.action,
      granted: p.granted,
    }));
  }

  @Put(':id/permissions')
  async updatePermissions(@Param('id') id: string, @Body() body: UpdatePermissionsDto) {
    await this.updateUserPermissionsUseCase.execute(id, body.permissions);
    return { success: true };
  }
}
