import { Module } from '../entities/module.entity';

export interface IModuleRepository {
  create(module: Module): Promise<Module>;
  findById(id: string): Promise<Module | null>;
  listByProject(projectId: string): Promise<Module[]>;
  delete(id: string): Promise<void>;
}

export const IModuleRepositoryToken = Symbol('IModuleRepository');
