import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IModuleAttachmentRepository } from '../../../core/domain/repositories/module-attachment-repository.interface';
import { ModuleAttachment } from '../../../core/domain/entities/module-attachment.entity';

@Injectable()
export class PrismaModuleAttachmentRepository implements IModuleAttachmentRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): ModuleAttachment {
    return new ModuleAttachment({
      id: raw.id,
      moduleId: raw.moduleId,
      userId: raw.userId,
      name: raw.name,
      type: raw.type,
      size: raw.size,
      dataUrl: raw.dataUrl,
      createdAt: raw.createdAt,
    });
  }

  async create(attachment: ModuleAttachment): Promise<ModuleAttachment> {
    const raw = await this.prisma.moduleAttachment.create({
      data: {
        id: attachment.id || undefined,
        moduleId: attachment.moduleId,
        userId: attachment.userId,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        dataUrl: attachment.dataUrl,
      },
    });
    return this.mapToDomain(raw);
  }

  async listByProject(projectId: string): Promise<ModuleAttachment[]> {
    const raws = await this.prisma.moduleAttachment.findMany({
      where: { module: { projectId } },
      orderBy: { createdAt: 'desc' },
    });
    return raws.map((r) => this.mapToDomain(r));
  }

  async listByModule(moduleId: string): Promise<ModuleAttachment[]> {
    const raws = await this.prisma.moduleAttachment.findMany({
      where: { moduleId },
      orderBy: { createdAt: 'desc' },
    });
    return raws.map((r) => this.mapToDomain(r));
  }

  async delete(id: string): Promise<void> {
    await this.prisma.moduleAttachment.delete({ where: { id } });
  }
}
