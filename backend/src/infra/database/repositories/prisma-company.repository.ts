import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ICompanyRepository } from '../../../core/domain/repositories/company-repository.interface';
import { Company } from '../../../core/domain/entities/company.entity';

@Injectable()
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): Company {
    return new Company({
      id: raw.id,
      name: raw.name,
      shortName: raw.shortName,
      color: raw.color,
      cnpj: raw.cnpj,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findById(id: string): Promise<Company | null> {
    const raw = await this.prisma.company.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async create(company: Company): Promise<Company> {
    const raw = await this.prisma.company.create({
      data: {
        id: company.id || undefined,
        name: company.name,
        shortName: company.shortName,
        color: company.color,
        cnpj: company.cnpj,
      },
    });
    return this.mapToDomain(raw);
  }

  async update(company: Company): Promise<Company> {
    const raw = await this.prisma.company.update({
      where: { id: company.id },
      data: {
        name: company.name,
        shortName: company.shortName,
        color: company.color,
        cnpj: company.cnpj,
      },
    });
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async listAll(): Promise<Company[]> {
    const raws = await this.prisma.company.findMany();
    return raws.map((raw) => this.mapToDomain(raw));
  }
}
