import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../../../core/domain/entities/enums';
import { LIMITS } from '../field-limits';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(LIMITS.user.name, { message: `O nome deve ter no máximo ${LIMITS.user.name} caracteres` })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Cargo deve ter pelo menos 2 caracteres' })
  @MaxLength(LIMITS.user.position, { message: `O cargo deve ter no máximo ${LIMITS.user.position} caracteres` })
  position?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Departamento deve ter pelo menos 2 caracteres' })
  @MaxLength(LIMITS.user.department, { message: `O departamento deve ter no máximo ${LIMITS.user.department} caracteres` })
  department?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Papel inválido (ADMIN ou DEVELOPER)' })
  role?: UserRole;
}
