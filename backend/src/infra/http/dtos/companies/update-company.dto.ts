import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  shortName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Cor deve ser um hex válido (#RRGGBB)' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  cnpj?: string | null;
}
