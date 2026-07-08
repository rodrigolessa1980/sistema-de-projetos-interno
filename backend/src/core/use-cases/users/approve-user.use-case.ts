import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';

@Injectable()
export class ApproveUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // findById usa o client estendido: só encontra usuários do mesmo tenant do
    // admin logado, garantindo que ninguém aprove usuário de outro grupo.
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário', id);
    }
    await this.userRepository.approve(id);
  }
}
