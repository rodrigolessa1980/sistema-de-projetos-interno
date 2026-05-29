import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { ConflictException } from '../../domain/exceptions/conflict.exception';
import { UserRole } from '../../domain/entities/enums';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  role?: UserRole;
}

export interface RegisterOutput {
  user: User;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const emailNormalized = input.email.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(emailNormalized);

    if (existingUser) {
      throw new ConflictException('Este e-mail já está sendo utilizado por outra conta.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.name)}`;

    const user = new User({
      name: input.name,
      email: emailNormalized,
      passwordHash,
      position: input.position,
      department: input.department,
      role: input.role || UserRole.DEVELOPER,
      avatar,
    });

    const savedUser = await this.userRepository.create(user);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const token = await this.jwtService.signAsync({
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return { user: savedUser, token, expiresAt };
  }
}
