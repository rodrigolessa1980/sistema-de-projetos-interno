import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
import { ICompanyRepositoryToken } from '../../domain/repositories/company-repository.interface';

export interface CreateCompanyInput {
  name: string;
  shortName: string;
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
      name: input.name.trim(),
      shortName: input.shortName.trim().toUpperCase(),
      color: input.color?.trim() || '#6366f1',
      cnpj: input.cnpj?.trim() || null,
    });

    return this.companyRepository.create(company);
  }
}
