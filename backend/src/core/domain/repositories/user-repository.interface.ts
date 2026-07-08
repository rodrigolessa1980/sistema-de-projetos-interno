import { User } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  /** Busca por e-mail DENTRO de um tenant (e-mail é único por grupo) — login/registro. */
  findByEmailAndTenant(email: string, tenantId: string): Promise<User | null>;
  create(user: User): Promise<User>;
  /** Cria usuário pendente de aprovação em um tenant específico (registro público). */
  registerPending(user: User, tenantId: string): Promise<User>;
  update(user: User): Promise<User>;
  /** Aprova um usuário (escopo de tenant aplicado automaticamente pela extensão). */
  approve(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  listAll(): Promise<User[]>;
  updateLastLogin(id: string): Promise<void>;
}
export const IUserRepositoryToken = Symbol('IUserRepository');
