import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IModuleRepository } from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';

@Injectable()
export class DeleteModuleUseCase {
  constructor(
    @Inject(IModuleRepositoryToken)
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.moduleRepository.findById(id);
    if (!existing) throw new NotFoundException('Módulo não encontrado');
    await this.moduleRepository.delete(id);
  }
}
