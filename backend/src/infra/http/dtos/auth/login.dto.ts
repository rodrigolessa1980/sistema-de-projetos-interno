import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsString()
  @MinLength(1, { message: 'Senha obrigatória' })
  password!: string;

  @IsString()
  @MinLength(1, { message: 'Selecione um grupo' })
  tenantSlug!: string;
}
