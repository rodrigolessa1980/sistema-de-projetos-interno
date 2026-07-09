import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/entities/enums';
import { ConflictException } from '../../domain/exceptions/conflict.exception';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  role: UserRole;
}

/**
 * Criação de usuário POR UM ADMIN (dentro do sistema). Diferente do registro
 * público (que sempre cria DEVELOPER pendente), aqui o papel escolhido é
 * respeitado e o usuário já entra aprovado e ativo. O tenant é o do admin
 * logado — injetado automaticamente pelo client estendido no `create`.
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const email = input.email.trim().toLowerCase();

    // E-mail é único POR GRUPO: só bloqueia se já existir NESTE tenant.
    const existing = await this.userRepository.findByEmailCurrentTenant(email);
    if (existing) {
      throw new ConflictException('Este e-mail já está sendo utilizado neste grupo.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.name)}`;

    const user = new User({
      name: input.name,
      email,
      passwordHash,
      position: input.position,
      department: input.department,
      role: input.role,
      avatar,
      isActive: true,
      isApproved: true,
    });

    return this.userRepository.create(user);
  }
}
