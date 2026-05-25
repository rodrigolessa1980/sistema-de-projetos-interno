import { PrismaService } from '../prisma/prisma.service';
import { ICompanyRepository } from '../../../core/domain/repositories/company-repository.interface';
import { Company } from '../../../core/domain/entities/company.entity';
export declare class PrismaCompanyRepository implements ICompanyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToDomain;
    findById(id: string): Promise<Company | null>;
    create(company: Company): Promise<Company>;
    update(company: Company): Promise<Company>;
    delete(id: string): Promise<void>;
    listAll(): Promise<Company[]>;
}
