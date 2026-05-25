import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../../domain/entities/company.entity';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
import { ICompanyRepositoryToken } from '../../domain/repositories/company-repository.interface';

@Injectable()
export class GetCompanyByIdUseCase {
  constructor(
    @Inject(ICompanyRepositoryToken)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(id: string): Promise<Company> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException('Empresa', id);
    }
    return company;
  }
}
