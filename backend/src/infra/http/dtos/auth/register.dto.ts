import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../../../core/domain/entities/enums';
import { LIMITS } from '../field-limits';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(LIMITS.user.name, { message: `O nome deve ter no máximo ${LIMITS.user.name} caracteres` })
  name!: string;

  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(LIMITS.user.email, { message: `O email deve ter no máximo ${LIMITS.user.email} caracteres` })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @MaxLength(LIMITS.user.passwordMax, { message: `A senha deve ter no máximo ${LIMITS.user.passwordMax} caracteres` })
  password!: string;

  @IsString()
  @MinLength(2, { message: 'Cargo deve ter pelo menos 2 caracteres' })
  @MaxLength(LIMITS.user.position, { message: `O cargo deve ter no máximo ${LIMITS.user.position} caracteres` })
  position!: string;

  @IsString()
  @MinLength(2, { message: 'Departamento deve ter pelo menos 2 caracteres' })
  @MaxLength(LIMITS.user.department, { message: `O departamento deve ter no máximo ${LIMITS.user.department} caracteres` })
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
