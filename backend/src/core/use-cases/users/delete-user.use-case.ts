import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, actorUserId: string): Promise<void> {
    if (id === actorUserId) {
      throw new BadRequestException('Você não pode excluir a própria conta.');
    }
    // findById usa o client estendido (isolado por tenant + já filtra deletedAt),
    // então admin só exclui usuário do próprio grupo e a exclusão é idempotente.
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    await this.userRepository.delete(id);
  }
}
