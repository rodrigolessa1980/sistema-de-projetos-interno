import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from '../../../core/domain/repositories/user-repository.interface';
import { User } from '../../../core/domain/entities/user.entity';
export declare class PrismaUserRepository implements IUserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToDomain;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: string): Promise<void>;
    listAll(): Promise<User[]>;
}
