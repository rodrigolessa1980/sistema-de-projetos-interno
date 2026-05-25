import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
export interface UpdateCompanyInput {
    id: string;
    name?: string;
    shortName?: string;
    color?: string;
    cnpj?: string | null;
}
export declare class UpdateCompanyUseCase {
    private readonly companyRepository;
    constructor(companyRepository: ICompanyRepository);
    execute(input: UpdateCompanyInput): Promise<Company>;
}
