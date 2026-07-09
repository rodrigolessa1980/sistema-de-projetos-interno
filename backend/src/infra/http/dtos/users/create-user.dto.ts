import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../../core/domain/entities/enums';

export class CreateUserDto {
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

  @IsEnum(UserRole, { message: 'Papel inválido (ADMIN ou DEVELOPER)' })
  role!: UserRole;
}
