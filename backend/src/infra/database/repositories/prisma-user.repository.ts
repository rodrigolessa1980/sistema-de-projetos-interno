import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from '../../../core/domain/repositories/user-repository.interface';
import { User } from '../../../core/domain/entities/user.entity';
import { UserRole } from '../../../core/domain/entities/enums';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private mapToDomain(raw: any): User {
    return new User({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      passwordHash: raw.passwordHash,
      role: raw.role as UserRole,
      avatar: raw.avatar,
      position: raw.position,
      department: raw.department,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async create(user: User): Promise<User> {
    const raw = await this.prisma.user.create({
      data: {
        id: user.id || undefined,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        avatar: user.avatar,
        position: user.position,
        department: user.department,
      },
    });
    return this.mapToDomain(raw);
  }

  async update(user: User): Promise<User> {
    const raw = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        avatar: user.avatar,
        position: user.position,
        department: user.department,
      },
    });
    return this.mapToDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async listAll(): Promise<User[]> {
    const raws = await this.prisma.user.findMany();
    return raws.map((raw) => this.mapToDomain(raw));
  }
}
