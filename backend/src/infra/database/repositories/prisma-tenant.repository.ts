import { Injectable } from '@nestjs/common';
import { BasePrismaService } from '../prisma/prisma.service';
import { ITenantRepository } from '../../../core/domain/repositories/tenant-repository.interface';
import { Tenant } from '../../../core/domain/entities/tenant.entity';

@Injectable()
export class PrismaTenantRepository implements ITenantRepository {
  // Tenant é a tabela "raiz" (não é filtrada por tenant) -> usa o client base.
  constructor(private base: BasePrismaService) {}

  private mapToDomain(raw: any): Tenant {
    return new Tenant({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findById(id: string): Promise<Tenant | null> {
    const raw = await this.base.tenant.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const raw = await this.base.tenant.findUnique({ where: { slug } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async listActive(): Promise<Tenant[]> {
    const raws = await this.base.tenant.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    return raws.map((raw) => this.mapToDomain(raw));
  }
}
