import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
export declare class GetCompanyByIdUseCase {
    private readonly companyRepository;
    constructor(companyRepository: ICompanyRepository);
    execute(id: string): Promise<Company>;
}
