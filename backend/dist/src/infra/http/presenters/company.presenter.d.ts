import { Company } from '../../../core/domain/entities/company.entity';
export interface CompanyResponse {
    id: string;
    name: string;
    shortName: string;
    color: string;
    cnpj: string | null;
    createdAt: string;
    updatedAt: string;
}
export declare class CompanyPresenter {
    static toHTTP(company: Company): CompanyResponse;
}
