import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { HEX_COLOR, LIMITS } from '../field-limits';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(LIMITS.company.name, { message: 'O nome da empresa deve ter no máximo 100 caracteres' })
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(LIMITS.company.shortName, { message: 'A sigla deve ter no máximo 10 caracteres' })
  shortName?: string;

  @IsOptional()
  @IsString()
  @Matches(HEX_COLOR, { message: 'Cor deve ser um hex válido (#RRGGBB)' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.company.cnpj, { message: 'O CNPJ deve ter no máximo 18 caracteres' })
  cnpj?: string | null;
}
