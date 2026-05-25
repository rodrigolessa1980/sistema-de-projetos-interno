import type { ICompanyRepository } from '../../domain/repositories/company-repository.interface';
export declare class DeleteCompanyUseCase {
    private readonly companyRepository;
    constructor(companyRepository: ICompanyRepository);
    execute(id: string): Promise<void>;
}
