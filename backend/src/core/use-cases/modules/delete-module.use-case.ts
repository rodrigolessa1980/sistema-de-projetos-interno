import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '../../domain/entities/enums';
import type { IModuleRepository } from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';
import { assertCanModifyModule } from './module-access';

@Injectable()
export class DeleteModuleUseCase {
  constructor(
    @Inject(IModuleRepositoryToken)
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async execute(id: string, requesterId: string, requesterRole: UserRole): Promise<void> {
    const existing = await this.moduleRepository.findById(id);
    if (!existing) throw new NotFoundException('Módulo não encontrado');
    assertCanModifyModule(existing, requesterId, requesterRole);
    await this.moduleRepository.delete(id);
  }
}
