import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUseCase } from '../../../core/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../../../core/use-cases/auth/register.use-case';
import { GetCurrentUserUseCase } from '../../../core/use-cases/auth/get-current-user.use-case';
import { ChangePasswordUseCase } from '../../../core/use-cases/auth/change-password.use-case';
import { ListTenantsUseCase } from '../../../core/use-cases/tenants/list-tenants.use-case';
import { LoginDto } from '../dtos/auth/login.dto';
import { RegisterDto } from '../dtos/auth/register.dto';
import { ChangePasswordDto } from '../dtos/auth/change-password.dto';
import { UserPresenter } from '../presenters/user.presenter';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';
import { UserRole } from '../../../core/domain/entities/enums';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly listTenantsUseCase: ListTenantsUseCase,
  ) {}

  // Público: lista os grupos disponíveis para a tela de cadastro.
  @Get('tenants')
  async tenants() {
    const tenants = await this.listTenantsUseCase.execute();
    return tenants.map((t) => ({ id: t.id, name: t.name, slug: t.slug }));
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.loginUseCase.execute({
      email: body.email,
      password: body.password,
      tenantSlug: body.tenantSlug,
    });

    return {
      user: UserPresenter.toHTTP(result.user),
      token: result.token,
      expiresAt: result.expiresAt.toISOString(),
    };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const result = await this.registerUseCase.execute({
      name: body.name,
      email: body.email,
      password: body.password,
      position: body.position,
      department: body.department,
      tenantSlug: body.tenantSlug,
    });

    return {
      user: UserPresenter.toHTTP(result.user),
      token: result.token,
      expiresAt: result.expiresAt.toISOString(),
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async me(@Req() req: AuthenticatedRequest) {
    const user = await this.getCurrentUserUseCase.execute(req.userId);
    return { user: UserPresenter.toHTTP(user) };
  }

  @Post('change-password')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: ChangePasswordDto,
  ) {
    await this.changePasswordUseCase.execute({
      userId: req.userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });
    return { success: true };
  }

  @Get('me/permissions')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  async myPermissions(@Req() req: AuthenticatedRequest) {
    return {
      userId: req.userId,
      role: req.userRole,
      authMethod: req.authMethod,
      permissions: [...req.permissions].sort(),
      isAdmin: req.userRole === UserRole.ADMIN,
    };
  }
}

