import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../../core/domain/entities/enums';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Cargo deve ter pelo menos 2 caracteres' })
  position?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Departamento deve ter pelo menos 2 caracteres' })
  department?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Papel inválido (ADMIN ou DEVELOPER)' })
  role?: UserRole;
}
