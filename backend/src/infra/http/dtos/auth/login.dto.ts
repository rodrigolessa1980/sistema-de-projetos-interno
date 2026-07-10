import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { LIMITS } from '../field-limits';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(LIMITS.user.email, { message: `O email deve ter no máximo ${LIMITS.user.email} caracteres` })
  email!: string;

  @IsString()
  @MinLength(1, { message: 'Senha obrigatória' })
  @MaxLength(LIMITS.user.passwordMax, { message: `A senha deve ter no máximo ${LIMITS.user.passwordMax} caracteres` })
  password!: string;

  @IsString()
  @MinLength(1, { message: 'Selecione um grupo' })
  tenantSlug!: string;
}
