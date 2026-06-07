import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IModuleRepository } from '../../../core/domain/repositories/module-repository.interface';
import { Module } from '../../../core/domain/entities/module.entity';

@Injectable()
export class PrismaModuleRepository implements IModuleRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): Module {
    return new Module({
      id: raw.id,
      projectId: raw.projectId,
      name: raw.name,
      description: raw.description,
      order: raw.order,
      progress: raw.progress,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(module: Module): Promise<Module> {
    const raw = await this.prisma.module.create({
      data: {
        id: module.id || undefined,
        projectId: module.projectId,
        name: module.name,
        description: module.description,
        order: module.order,
        progress: module.progress,
      },
    });
    return this.mapToDomain(raw);
  }

  async findById(id: string): Promise<Module | null> {
    const raw = await this.prisma.module.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async listByProject(projectId: string): Promise<Module[]> {
    const raws = await this.prisma.module.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
    return raws.map((r) => this.mapToDomain(r));
  }

  async update(id: string, data: { name?: string; description?: string }): Promise<Module> {
    const raw = await this.prisma.module.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.module.delete({ where: { id } });
  }
}
