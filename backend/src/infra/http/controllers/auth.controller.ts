import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUseCase } from '../../../core/use-cases/auth/login.use-case';
import { GetCurrentUserUseCase } from '../../../core/use-cases/auth/get-current-user.use-case';
import { LoginDto } from '../dtos/auth/login.dto';
import { UserPresenter } from '../presenters/user.presenter';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.loginUseCase.execute({
      email: body.email,
      password: body.password,
    });

    return {
      user: UserPresenter.toHTTP(result.user),
      token: result.token,
      expiresAt: result.expiresAt.toISOString(),
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: AuthenticatedRequest) {
    const user = await this.getCurrentUserUseCase.execute(req.userId);
    return { user: UserPresenter.toHTTP(user) };
  }
}
