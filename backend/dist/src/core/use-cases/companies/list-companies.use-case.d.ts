import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
export declare class ListCompaniesUseCase {
    private readonly companyRepository;
    constructor(companyRepository: ICompanyRepository);
    execute(): Promise<Company[]>;
}
