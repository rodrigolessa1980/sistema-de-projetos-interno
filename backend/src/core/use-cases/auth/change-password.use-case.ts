import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { UnauthorizedException } from '../../domain/exceptions/unauthorized.exception';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

/**
 * Troca a senha do PRÓPRIO usuário logado (tela de perfil/configurações).
 * Exige a senha atual para confirmar a identidade. O tenant é o do request
 * (client estendido faz o escopo em findById/update automaticamente).
 */
@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundException('Usuário');
    }

    const matches = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('A senha atual está incorreta.');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 10);

    // O entity é imutável: reconstrói com o novo hash preservando os demais dados.
    const updated = new User({
      id: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      passwordHash,
      role: user.role,
      avatar: user.avatar,
      position: user.position,
      department: user.department,
      isActive: user.isActive,
      isApproved: user.isApproved,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    await this.userRepository.update(updated);
  }
}
