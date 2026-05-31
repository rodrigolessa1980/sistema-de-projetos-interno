import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UnauthorizedException } from '../../domain/exceptions/unauthorized.exception';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';

export interface LoginInput {
  email: string;
  password: string;
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
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email.trim().toLowerCase());

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
    });

    return { user, token, expiresAt };
  }
}
