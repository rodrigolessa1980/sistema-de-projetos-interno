import { Company } from '../../domain/entities/company.entity';
import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
export interface CreateCompanyInput {
    name: string;
    shortName: string;
    color?: string;
    cnpj?: string | null;
}
export declare class CreateCompanyUseCase {
    private readonly companyRepository;
    constructor(companyRepository: ICompanyRepository);
    execute(input: CreateCompanyInput): Promise<Company>;
}
