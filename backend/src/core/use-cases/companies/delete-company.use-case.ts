import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
import { ICompanyRepositoryToken } from '../../domain/repositories/company-repository.interface';

@Injectable()
export class DeleteCompanyUseCase {
  constructor(
    @Inject(ICompanyRepositoryToken)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.companyRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Empresa', id);
    }
    await this.companyRepository.delete(id);
  }
}
