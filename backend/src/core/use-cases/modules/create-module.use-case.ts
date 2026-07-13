import { Inject, Injectable } from '@nestjs/common';
import { Module } from '../../domain/entities/module.entity';
import { ModuleStatus } from '../../domain/entities/enums';
import type { IModuleRepository } from '../../domain/repositories/module-repository.interface';
import { IModuleRepositoryToken } from '../../domain/repositories/module-repository.interface';

export interface CreateModuleInput {
  projectId: string;
  name: string;
  description: string;
  status?: ModuleStatus;
  order?: number;
  /** Quem está criando o módulo — vira o dono (createdById). */
  userId?: string;
}

function progressForStatus(status: ModuleStatus): number {
  const progressByStatus: Record<ModuleStatus, number> = {
    [ModuleStatus.INICIADO]: 0,
    [ModuleStatus.EM_PROCESSO]: 50,
    [ModuleStatus.CONCLUIDO]: 100,
  };
  return progressByStatus[status];
}

@Injectable()
export class CreateModuleUseCase {
  constructor(
    @Inject(IModuleRepositoryToken)
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async execute(input: CreateModuleInput): Promise<Module> {
    const existing = await this.moduleRepository.listByProject(input.projectId);
    const status = input.status ?? ModuleStatus.INICIADO;
    const module = new Module({
      projectId: input.projectId,
      name: input.name,
      description: input.description,
      status,
      progress: progressForStatus(status),
      order: input.order ?? existing.length,
      createdById: input.userId ?? null,
    });
    return this.moduleRepository.create(module);
  }
}
