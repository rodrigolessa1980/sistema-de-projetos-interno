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

export class CompanyPresenter {
  static toHTTP(company: Company): CompanyResponse {
    return {
      id: company.id,
      name: company.name,
      shortName: company.shortName,
      color: company.color,
      cnpj: company.cnpj,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };
  }
}
