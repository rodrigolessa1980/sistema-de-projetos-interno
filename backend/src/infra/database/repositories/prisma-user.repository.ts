import { Injectable } from '@nestjs/common';
import { BasePrismaService, PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from '../../../core/domain/repositories/user-repository.interface';
import { User } from '../../../core/domain/entities/user.entity';
import { UserRole } from '../../../core/domain/entities/enums';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    // Client estendido (isolado por tenant) para operações dentro do request.
    private prisma: PrismaService,
    // Client base (sem filtro) para fluxos globais/pré-auth: login e registro.
    private base: BasePrismaService,
  ) {}

  private mapToDomain(raw: any): User {
    return new User({
      id: raw.id,
      tenantId: raw.tenantId,
      name: raw.name,
      email: raw.email,
      passwordHash: raw.passwordHash,
      role: raw.role as UserRole,
      avatar: raw.avatar,
      position: raw.position,
      department: raw.department,
      isActive: raw.isActive,
      isApproved: raw.isApproved,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async findByEmailAndTenant(email: string, tenantId: string): Promise<User | null> {
    // E-mail é único POR GRUPO: busca no client base (sem contexto) filtrando por tenant.
    const raw = await this.base.user.findFirst({ where: { email, tenantId } });
    return raw ? this.mapToDomain(raw) : null;
  }

  async findByEmailCurrentTenant(email: string): Promise<User | null> {
    // Client estendido: filtra automaticamente pelo tenant do admin logado.
    const raw = await this.prisma.user.findFirst({ where: { email } });
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
        isActive: user.isActive,
        isApproved: user.isApproved,
      },
    });
    return this.mapToDomain(raw);
  }

  async registerPending(user: User, tenantId: string): Promise<User> {
    // Registro público: sem contexto de tenant -> client base com tenantId explícito.
    const raw = await this.base.user.create({
      data: {
        id: user.id || undefined,
        tenantId,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        avatar: user.avatar,
        position: user.position,
        department: user.department,
        isActive: true,
        isApproved: false,
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
        isActive: user.isActive,
        isApproved: user.isApproved,
        lastLoginAt: user.lastLoginAt,
      },
    });
    return this.mapToDomain(raw);
  }

  async approve(id: string): Promise<void> {
    // Escopo de tenant garantido pela extensão: um admin só aprova usuários do seu tenant.
    await this.prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async listAll(): Promise<User[]> {
    const raws = await this.prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
    return raws.map((raw) => this.mapToDomain(raw));
  }

  async updateLastLogin(id: string): Promise<void> {
    // Login é público (sem contexto de tenant) -> client base.
    await this.base.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }
}
