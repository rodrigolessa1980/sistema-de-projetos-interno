import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
import { ICompanyRepositoryToken } from '../../domain/repositories/company-repository.interface';

export interface UpdateCompanyInput {
  id: string;
  name?: string;
  shortName?: string;
  color?: string;
  cnpj?: string | null;
}

@Injectable()
export class UpdateCompanyUseCase {
  constructor(
    @Inject(ICompanyRepositoryToken)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(input: UpdateCompanyInput): Promise<Company> {
    const existing = await this.companyRepository.findById(input.id);
    if (!existing) {
      throw new NotFoundException('Empresa', input.id);
    }

    const company = new Company({
      id: existing.id,
      name: input.name?.trim() ?? existing.name,
      shortName: input.shortName?.trim().toUpperCase() ?? existing.shortName,
      color: input.color?.trim() ?? existing.color,
      cnpj: input.cnpj !== undefined ? (input.cnpj?.trim() || null) : existing.cnpj,
      createdAt: existing.createdAt,
    });

    return this.companyRepository.update(company);
  }
}
