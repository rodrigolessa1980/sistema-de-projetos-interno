import { Body, Controller, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireAdmin, RequirePermission } from '../decorators/require-permission.decorator';
import { ListUsersUseCase } from '../../../core/use-cases/users/list-users.use-case';
import { GetUserPermissionsUseCase } from '../../../core/use-cases/users/get-user-permissions.use-case';
import { UpdateUserPermissionsUseCase } from '../../../core/use-cases/users/update-user-permissions.use-case';
import { ApproveUserUseCase } from '../../../core/use-cases/users/approve-user.use-case';
import { CreateUserUseCase } from '../../../core/use-cases/users/create-user.use-case';
import { UpdateUserUseCase } from '../../../core/use-cases/users/update-user.use-case';
import { UpdatePermissionsDto } from '../dtos/users/update-permissions.dto';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { UserPresenter } from '../presenters/user.presenter';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserPermissionsUseCase: GetUserPermissionsUseCase,
    private readonly updateUserPermissionsUseCase: UpdateUserPermissionsUseCase,
    private readonly approveUserUseCase: ApproveUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Post()
  @RequirePermission('users:create')
  @RequireAdmin()
  async create(@Body() body: CreateUserDto) {
    // Tenant é o do admin logado (injetado pelo client estendido no create).
    const user = await this.createUserUseCase.execute({
      name: body.name,
      email: body.email,
      password: body.password,
      position: body.position,
      department: body.department,
      role: body.role,
    });
    return UserPresenter.toHTTP(user);
  }

  @Put(':id')
  @RequirePermission('users:update')
  @RequireAdmin()
  async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    // Escopo de tenant no use-case: admin só edita usuários do próprio grupo.
    const user = await this.updateUserUseCase.execute(id, {
      name: body.name,
      position: body.position,
      department: body.department,
      role: body.role,
    });
    return UserPresenter.toHTTP(user);
  }

  @Get()
  @RequirePermission('users:read')
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
  @RequirePermission('users:read')
  async getPermissions(@Param('id') id: string) {
    const permissions = await this.getUserPermissionsUseCase.execute(id);
    return permissions.map((p) => ({
      module: p.module,
      action: p.action,
      granted: p.granted,
    }));
  }

  @Put(':id/permissions')
  @RequirePermission('users:update')
  @RequireAdmin()
  async updatePermissions(@Param('id') id: string, @Body() body: UpdatePermissionsDto) {
    await this.updateUserPermissionsUseCase.execute(id, body.permissions);
    return { success: true };
  }

  @Post(':id/approve')
  @HttpCode(200)
  @RequirePermission('users:update')
  @RequireAdmin()
  async approve(@Param('id') id: string) {
    // Escopo de tenant aplicado no use-case: admin só aprova usuários do próprio grupo.
    await this.approveUserUseCase.execute(id);
    return { success: true };
  }
}
