import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Module } from '../../domain/entities/module.entity';
import { ModuleStatus } from '../../domain/entities/enums';
import type { IModuleRepository } from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';

export interface UpdateModuleInput {
  name?: string;
  description?: string;
  status?: ModuleStatus;
  workDate?: Date | null;
  hours?: number | null;
  assignedUserId?: string;
}

@Injectable()
export class UpdateModuleUseCase {
  constructor(
    @Inject(IModuleRepositoryToken)
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async execute(id: string, input: UpdateModuleInput): Promise<Module> {
    const existing = await this.moduleRepository.findById(id);
    if (!existing) throw new NotFoundException('Módulo não encontrado');
    return this.moduleRepository.update(id, input);
  }
}
