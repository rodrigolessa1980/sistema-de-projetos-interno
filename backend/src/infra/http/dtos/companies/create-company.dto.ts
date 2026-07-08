import { IsOptional, IsString, IsUUID, Matches, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  // INC-04: id opcional gerado no cliente (otimismo estável, sem swap de id no front).
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  shortName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Cor deve ser um hex válido (#RRGGBB)' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(18)
  cnpj?: string;
}
