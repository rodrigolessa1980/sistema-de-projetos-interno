import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
import { ICompanyRepositoryToken } from '../../domain/repositories/company-repository.interface';

export interface CreateCompanyInput {
  id?: string;
  name?: string;
  shortName?: string;
  color?: string;
  cnpj?: string | null;
}

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject(ICompanyRepositoryToken)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(input: CreateCompanyInput): Promise<Company> {
    const company = new Company({
      id: input.id,
      name: input.name?.trim() || `Empresa ${new Date().toLocaleString('pt-BR')}`,
      shortName: (input.shortName?.trim() || 'EMP').toUpperCase(),
      color: input.color?.trim() || '#6366f1',
      cnpj: input.cnpj?.trim() || null,
    });

    return this.companyRepository.create(company);
  }
}
