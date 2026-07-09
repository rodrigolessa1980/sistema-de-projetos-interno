import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/entities/enums';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';

export interface UpdateUserInput {
  name?: string;
  position?: string;
  department?: string;
  role?: UserRole;
}

/**
 * Edita um usuário existente (papel, nome, cargo, departamento). Usado tanto
 * pela edição no dialog quanto pelo atalho "tornar admin / developer".
 * `findById`/`update` usam o client estendido: um admin só altera usuários do
 * próprio grupo.
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, input: UpdateUserInput): Promise<User> {
    const current = await this.userRepository.findById(id);
    if (!current) {
      throw new NotFoundException('Usuário', id);
    }

    const updated = new User({
      id: current.id,
      tenantId: current.tenantId,
      name: input.name ?? current.name,
      email: current.email,
      passwordHash: current.passwordHash,
      role: input.role ?? current.role,
      avatar: current.avatar,
      position: input.position ?? current.position,
      department: input.department ?? current.department,
      isActive: current.isActive,
      isApproved: current.isApproved,
      lastLoginAt: current.lastLoginAt,
      createdAt: current.createdAt,
      updatedAt: current.updatedAt,
    });

    return this.userRepository.update(updated);
  }
}
