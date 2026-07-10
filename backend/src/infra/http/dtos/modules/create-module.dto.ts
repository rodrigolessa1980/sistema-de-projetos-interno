import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ModuleStatus } from '../../../../core/domain/entities/enums';
import { LIMITS } from '../field-limits';

export class ModuleAttachmentInputDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number;

  @IsString()
  @IsNotEmpty()
  dataUrl: string;
}

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITS.module.name, { message: `O nome do módulo deve ter no máximo ${LIMITS.module.name} caracteres` })
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.module.description, { message: `A descrição do módulo deve ter no máximo ${LIMITS.module.description} caracteres` })
  description?: string;

  @IsOptional()
  @IsEnum(ModuleStatus)
  status?: ModuleStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  order?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  hours?: number;

  @IsOptional()
  @IsDateString()
  workDate?: string;

  /** A quem atribuir as horas (só admin pode definir outro usuário). */
  @IsOptional()
  @IsString()
  assignedUserId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleAttachmentInputDto)
  attachments?: ModuleAttachmentInputDto[];
}
