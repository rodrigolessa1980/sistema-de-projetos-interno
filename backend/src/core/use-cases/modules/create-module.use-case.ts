import { Inject, Injectable } from '@nestjs/common';
import { Module } from '../../domain/entities/module.entity';
import type { IModuleRepository } from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';

export interface CreateModuleInput {
  projectId: string;
  name: string;
  description: string;
  order?: number;
}

@Injectable()
export class CreateModuleUseCase {
  constructor(
    @Inject(IModuleRepositoryToken)
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async execute(input: CreateModuleInput): Promise<Module> {
    const existing = await this.moduleRepository.listByProject(input.projectId);
    const module = new Module({
      projectId: input.projectId,
      name: input.name,
      description: input.description,
      order: input.order ?? existing.length,
    });
    return this.moduleRepository.create(module);
  }
}
