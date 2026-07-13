import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
import { ICompanyRepositoryToken } from '../../domain/repositories/company-repository.interface';
import type { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { IProjectRepositoryToken } from '../../domain/repositories/project-repository.interface';

@Injectable()
export class DeleteCompanyUseCase {
  constructor(
    @Inject(ICompanyRepositoryToken)
    private readonly companyRepository: ICompanyRepository,
    @Inject(IProjectRepositoryToken)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.companyRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Empresa', id);
    }
    // Antes o FK Restrict barrava excluir empresa com projetos; como agora é soft
    // delete (update), a checagem passa a ser explícita p/ não deixar projetos órfãos.
    const linked = await this.projectRepository.findByCompanyId(id);
    if (linked.length > 0) {
      throw new BadRequestException(
        `Não é possível excluir: ${linked.length} projeto(s) vinculado(s) a esta empresa.`,
      );
    }
    await this.companyRepository.delete(id);
  }
}
