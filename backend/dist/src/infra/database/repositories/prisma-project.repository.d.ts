import { PrismaService } from '../prisma/prisma.service';
import { IProjectRepository } from '../../../core/domain/repositories/project-repository.interface';
import { Project } from '../../../core/domain/entities/project.entity';
export declare class PrismaProjectRepository implements IProjectRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToDomain;
    findById(id: string): Promise<Project | null>;
    create(project: Project): Promise<Project>;
    update(project: Project): Promise<Project>;
    delete(id: string): Promise<void>;
    listAll(): Promise<Project[]>;
    findByCompanyId(companyId: string): Promise<Project[]>;
    getQueuedProjects(): Promise<Project[]>;
    updateQueueOrder(orderedIds: string[]): Promise<void>;
}
