import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
import { ICompanyRepositoryToken } from '../../domain/repositories/company-repository.interface';

@Injectable()
export class ListCompaniesUseCase {
  constructor(
    @Inject(ICompanyRepositoryToken)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(): Promise<Company[]> {
    return this.companyRepository.listAll();
  }
}
