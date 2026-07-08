import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UnauthorizedException } from '../../domain/exceptions/unauthorized.exception';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';
import type { ITenantRepository } from '../../domain/repositories/tenant-repository.interface';
import { ITenantRepositoryToken } from '../../domain/repositories/tenant-repository.interface';

export interface LoginInput {
  email: string;
  password: string;
  /** Grupo (tenant) escolhido no login. O mesmo e-mail pode existir em grupos distintos. */
  tenantSlug: string;
}

export interface LoginOutput {
  user: User;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(ITenantRepositoryToken)
    private readonly tenantRepository: ITenantRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug.trim().toLowerCase());
    if (!tenant || !tenant.isActive) {
      throw new UnauthorizedException('Grupo selecionado é inválido ou está inativo.');
    }

    const user = await this.userRepository.findByEmailAndTenant(
      input.email.trim().toLowerCase(),
      tenant.id,
    );

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas. Verifique seu email e senha.');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas. Verifique seu email e senha.');
    }

    await this.userRepository.updateLastLogin(user.id);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    });

    return { user, token, expiresAt };
  }
}
