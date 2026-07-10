import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { LIMITS } from '../field-limits';

export class CreateApiTokenDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITS.apiToken.name, { message: `O nome do token deve ter no máximo ${LIMITS.apiToken.name} caracteres` })
  name!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scopes?: string[];

  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;
}
