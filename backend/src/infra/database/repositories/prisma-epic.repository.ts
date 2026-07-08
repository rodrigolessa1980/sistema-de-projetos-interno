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
      developerIds: raw.developers?.map((d: any) => d.userId) ?? [],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async create(epic: Epic): Promise<Epic> {
    return this.prisma.$transaction(async (tx) => {
      const raw: any = await tx.epic.create({
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
      // EpicDeveloper é tenant-scoped; criado via chamadas top-level para a
      // extensão injetar o tenantId (writes aninhados não passam pela extensão
      // e cairiam no @default(uuid()) do schema -> FK inválida).
      raw.developers = [];
      for (const userId of epic.developerIds) {
        raw.developers.push(await tx.epicDeveloper.create({ data: { epicId: raw.id, userId } }));
      }
      return this.mapToDomain(raw);
    });
  }

  async findById(id: string): Promise<Epic | null> {
    const raw = await this.prisma.epic.findUnique({ where: { id }, include: { developers: true } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async listByModule(moduleId: string): Promise<Epic[]> {
    const raws = await this.prisma.epic.findMany({ where: { moduleId }, include: { developers: true } });
    return raws.map((r) => this.mapToDomain(r));
  }

  async listByProject(projectId: string): Promise<Epic[]> {
    const raws = await this.prisma.epic.findMany({ where: { projectId }, include: { developers: true } });
    return raws.map((r) => this.mapToDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.epic.delete({ where: { id } });
  }
}
