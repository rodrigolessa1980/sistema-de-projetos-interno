import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IEpicRepository } from '../../../core/domain/repositories/epic-repository.interface';
import { Epic } from '../../../core/domain/entities/epic.entity';
import { ProjectStatus } from '../../../core/domain/entities/enums';

@Injectable()
export class PrismaEpicRepository implements IEpicRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): Epic {
    return new Epic({
      id: raw.id,
      projectId: raw.projectId,
      moduleId: raw.moduleId,
      name: raw.name,
      description: raw.description,
      status: raw.status as ProjectStatus,
      startDate: raw.startDate,
      endDate: raw.endDate ?? null,
      progress: raw.progress,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(epic: Epic): Promise<Epic> {
    const raw = await this.prisma.epic.create({
      data: {
        id: epic.id || undefined,
        projectId: epic.projectId,
        moduleId: epic.moduleId,
        name: epic.name,
        description: epic.description,
        status: epic.status,
        startDate: epic.startDate,
        endDate: epic.endDate,
        progress: epic.progress,
      },
    });
    return this.mapToDomain(raw);
  }

  async findById(id: string): Promise<Epic | null> {
    const raw = await this.prisma.epic.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async listByModule(moduleId: string): Promise<Epic[]> {
    const raws = await this.prisma.epic.findMany({ where: { moduleId } });
    return raws.map((r) => this.mapToDomain(r));
  }

  async listByProject(projectId: string): Promise<Epic[]> {
    const raws = await this.prisma.epic.findMany({ where: { projectId } });
    return raws.map((r) => this.mapToDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.epic.delete({ where: { id } });
  }
}
