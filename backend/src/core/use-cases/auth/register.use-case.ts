import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { ConflictException } from '../../domain/exceptions/conflict.exception';
import { NotFoundException } from '../../domain/exceptions/not-found.exception';
import { UserRole } from '../../domain/entities/enums';
import type { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { IUserRepositoryToken } from '../../domain/repositories/user-repository.interface';
import type { ITenantRepository } from '../../domain/repositories/tenant-repository.interface';
import { ITenantRepositoryToken } from '../../domain/repositories/tenant-repository.interface';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  position: string;
  department: string;
  /** Slug do grupo (tenant) escolhido no cadastro. */
  tenantSlug: string;
}

export interface RegisterOutput {
  user: User;
  token: string;
  expiresAt: Date;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(ITenantRepositoryToken)
    private readonly tenantRepository: ITenantRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const emailNormalized = input.email.trim().toLowerCase();

    // Grupo escolhido precisa existir e estar ativo.
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug.trim().toLowerCase());
    if (!tenant || !tenant.isActive) {
      throw new NotFoundException('Grupo selecionado é inválido ou está inativo.');
    }

    // E-mail é único POR GRUPO: só bloqueia se já existir NESTE tenant.
    const existingUser = await this.userRepository.findByEmailAndTenant(emailNormalized, tenant.id);
    if (existingUser) {
      throw new ConflictException('Este e-mail já está sendo utilizado neste grupo.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.name)}`;

    // Registro público SEMPRE cria DEVELOPER pendente de aprovação (nunca ADMIN).
    const user = new User({
      name: input.name,
      email: emailNormalized,
      passwordHash,
      position: input.position,
      department: input.department,
      role: UserRole.DEVELOPER,
      avatar,
      isApproved: false,
    });

    const savedUser = await this.userRepository.registerPending(user, tenant.id);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const token = await this.jwtService.signAsync({
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
      tenantId: savedUser.tenantId,
    });

    return { user: savedUser, token, expiresAt };
  }
}
