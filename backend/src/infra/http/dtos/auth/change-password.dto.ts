import { IsString, MaxLength, MinLength } from 'class-validator';
import { LIMITS } from '../field-limits';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1, { message: 'Informe a senha atual' })
  currentPassword!: string;

  @IsString()
  @MinLength(LIMITS.user.passwordMin, {
    message: `A nova senha deve ter pelo menos ${LIMITS.user.passwordMin} caracteres`,
  })
  @MaxLength(LIMITS.user.passwordMax, {
    message: `A nova senha deve ter no máximo ${LIMITS.user.passwordMax} caracteres`,
  })
  newPassword!: string;
}
