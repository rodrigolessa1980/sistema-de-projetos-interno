import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IProjectRepository } from '../../../core/domain/repositories/project-repository.interface';
import { Project } from '../../../core/domain/entities/project.entity';
import { ProjectStatus } from '../../../core/domain/entities/enums';

@Injectable()
export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): Project & { developerIds: string[] } {
    const entity = new Project({
      id: raw.id,
      companyId: raw.companyId,
      name: raw.name,
      description: raw.description,
      status: raw.status as ProjectStatus,
      ownerId: raw.ownerId,
      startDate: raw.startDate,
      endDate: raw.endDate,
      estimatedHours: raw.estimatedHours,
      actualHours: Number(raw.actualHours),
      progress: raw.progress,
      color: raw.color,
      avatar: raw.avatar,
      testUrl: raw.testUrl,
      queueOrder: raw.queueOrder,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }) as Project & { developerIds: string[] };
    entity.developerIds = (raw.developers ?? []).map((d: any) => d.userId);
    return entity;
  }

  private includeDevs = { developers: { select: { userId: true } } } as const;

  async findById(id: string): Promise<Project | null> {
    const raw = await this.prisma.project.findUnique({ where: { id }, include: this.includeDevs });
    return raw ? this.mapToDomain(raw) : null;
  }

  async create(project: Project): Promise<Project> {
    const raw = await this.prisma.project.create({
      data: {
        id: project.id || undefined,
        companyId: project.companyId ?? undefined,
        name: project.name,
        description: project.description,
        status: project.status,
        ownerId: project.ownerId,
        startDate: project.startDate,
        endDate: project.endDate,
        estimatedHours: project.estimatedHours,
        actualHours: project.actualHours,
        progress: project.progress,
        color: project.color,
        avatar: project.avatar,
        testUrl: project.testUrl,
        queueOrder: project.queueOrder,
      },
      include: this.includeDevs,
    });
    return this.mapToDomain(raw);
  }

  async update(project: Project): Promise<Project> {
    const raw = await this.prisma.project.update({
      where: { id: project.id },
      data: {
        name: project.name,
        description: project.description,
        status: project.status,
        ownerId: project.ownerId,
        startDate: project.startDate,
        endDate: project.endDate,
        estimatedHours: project.estimatedHours,
        actualHours: project.actualHours,
        progress: project.progress,
        color: project.color,
        avatar: project.avatar,
        testUrl: project.testUrl,
        queueOrder: project.queueOrder,
      },
      include: this.includeDevs,
    });
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }

  async listAll(): Promise<Project[]> {
    const raws = await this.prisma.project.findMany({ include: this.includeDevs });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async findByCompanyId(companyId: string): Promise<Project[]> {
    const raws = await this.prisma.project.findMany({ where: { companyId }, include: this.includeDevs });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async getQueuedProjects(): Promise<Project[]> {
    const raws = await this.prisma.project.findMany({
      where: {
        queueOrder: { not: null },
        status: { notIn: [ProjectStatus.CONCLUIDO, ProjectStatus.CANCELADO] },
      },
      orderBy: { queueOrder: 'asc' },
      include: this.includeDevs,
    });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async addDeveloper(projectId: string, userId: string): Promise<void> {
    await this.prisma.projectDeveloper.upsert({
      where: { projectId_userId: { projectId, userId } },
      create: { projectId, userId },
      update: {},
    });
  }

  async removeDeveloper(projectId: string, userId: string): Promise<void> {
    await this.prisma.projectDeveloper.deleteMany({ where: { projectId, userId } });
  }

  async updateActualHours(projectId: string, hours: number): Promise<void> {
    await this.prisma.project.update({
      where: { id: projectId },
      data: { actualHours: hours },
    });
  }

  async updateQueueOrder(orderedIds: string[]): Promise<void> {
    await this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.project.update({
          where: { id },
          data: { queueOrder: index + 1 },
        })
      )
    );
  }
}
