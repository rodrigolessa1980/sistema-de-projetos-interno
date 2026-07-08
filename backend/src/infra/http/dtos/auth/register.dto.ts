import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../../core/domain/entities/enums';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name!: string;

  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password!: string;

  @IsString()
  @MinLength(2, { message: 'Cargo deve ter pelo menos 2 caracteres' })
  position!: string;

  @IsString()
  @MinLength(2, { message: 'Departamento deve ter pelo menos 2 caracteres' })
  department!: string;

  // Grupo (tenant) que o usuário deseja ingressar. Ele entra como pendente
  // e um admin desse grupo precisa aprovar.
  @IsString({ message: 'Selecione um grupo' })
  @MinLength(1, { message: 'Selecione um grupo' })
  tenantSlug!: string;

  // Ignorado no registro público (papel é sempre DEVELOPER). Mantido apenas
  // para compatibilidade de payload.
  @IsEnum(UserRole, { message: 'Regra de usuário inválida (ADMIN ou DEVELOPER)' })
  @IsOptional()
  role?: UserRole;
}
