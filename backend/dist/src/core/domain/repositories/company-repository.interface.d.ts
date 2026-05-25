import { Company } from '../entities/company.entity';
export interface ICompanyRepository {
    findById(id: string): Promise<Company | null>;
    create(company: Company): Promise<Company>;
    update(company: Company): Promise<Company>;
    delete(id: string): Promise<void>;
    listAll(): Promise<Company[]>;
}
export declare const ICompanyRepositoryToken: unique symbol;
