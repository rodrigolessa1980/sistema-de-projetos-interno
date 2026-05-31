import { UserRole } from './enums';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  avatar?: string | null;
  position: string;
  department: string;
  isActive?: boolean;
  lastLoginAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private props: Required<UserProps>;

  constructor(props: UserProps) {
    this.props = {
      id: props.id || '',
      name: props.name,
      email: props.email,
      passwordHash: props.passwordHash,
      role: props.role || UserRole.DEVELOPER,
      avatar: props.avatar || null,
      position: props.position,
      department: props.department,
      isActive: props.isActive ?? true,
      lastLoginAt: props.lastLoginAt ?? null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
    this.validate();
  }

  private validate() {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Nome do usuário é obrigatório.');
    }
    if (!this.props.email || !this.props.email.includes('@')) {
      throw new Error('E-mail do usuário deve ser válido.');
    }
  }

  public get id(): string { return this.props.id; }
  public get name(): string { return this.props.name; }
  public get email(): string { return this.props.email; }
  public get passwordHash(): string { return this.props.passwordHash; }
  public get role(): UserRole { return this.props.role; }
  public get avatar(): string | null { return this.props.avatar; }
  public get position(): string { return this.props.position; }
  public get department(): string { return this.props.department; }
  public get isActive(): boolean { return this.props.isActive; }
  public get lastLoginAt(): Date | null { return this.props.lastLoginAt; }
  public get createdAt(): Date { return this.props.createdAt; }
  public get updatedAt(): Date { return this.props.updatedAt; }
}
