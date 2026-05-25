import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário', userId);
    }
    return user;
  }
}
