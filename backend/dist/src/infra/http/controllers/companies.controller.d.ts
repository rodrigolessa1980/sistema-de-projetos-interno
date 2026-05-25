import { ListCompaniesUseCase } from '../../../core/use-cases/companies/list-companies.use-case';
import { GetCompanyByIdUseCase } from '../../../core/use-cases/companies/get-company-by-id.use-case';
import { CreateCompanyUseCase } from '../../../core/use-cases/companies/create-company.use-case';
import { UpdateCompanyUseCase } from '../../../core/use-cases/companies/update-company.use-case';
import { DeleteCompanyUseCase } from '../../../core/use-cases/companies/delete-company.use-case';
import { CreateCompanyDto } from '../dtos/companies/create-company.dto';
import { UpdateCompanyDto } from '../dtos/companies/update-company.dto';
export declare class CompaniesController {
    private readonly listCompaniesUseCase;
    private readonly getCompanyByIdUseCase;
    private readonly createCompanyUseCase;
    private readonly updateCompanyUseCase;
    private readonly deleteCompanyUseCase;
    constructor(listCompaniesUseCase: ListCompaniesUseCase, getCompanyByIdUseCase: GetCompanyByIdUseCase, createCompanyUseCase: CreateCompanyUseCase, updateCompanyUseCase: UpdateCompanyUseCase, deleteCompanyUseCase: DeleteCompanyUseCase);
    list(): Promise<{
        companies: import("../presenters/company.presenter").CompanyResponse[];
    }>;
    getById(id: string): Promise<{
        company: import("../presenters/company.presenter").CompanyResponse;
    }>;
    create(body: CreateCompanyDto): Promise<{
        company: import("../presenters/company.presenter").CompanyResponse;
    }>;
    update(id: string, body: UpdateCompanyDto): Promise<{
        company: import("../presenters/company.presenter").CompanyResponse;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
