import { IsArray, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min } from 'class-validator';
import { ProjectStatus } from '../../../../core/domain/entities/enums';
import { HEX_COLOR, PROJECT_LIMITS } from './project.constraints';

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LIMITS.name, { message: `O nome do projeto deve ter no máximo ${PROJECT_LIMITS.name} caracteres` })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LIMITS.description, { message: `A descrição deve ter no máximo ${PROJECT_LIMITS.description} caracteres` })
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LIMITS.technicalDescription, { message: `A descrição técnica deve ter no máximo ${PROJECT_LIMITS.technicalDescription} caracteres` })
  technicalDescription?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LIMITS.requestedBy, { message: `O campo "Solicitado por" deve ter no máximo ${PROJECT_LIMITS.requestedBy} caracteres` })
  requestedBy?: string | null;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'Status inválido' })
  status?: ProjectStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Data de início inválida' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Prazo de entrega inválido' })
  endDate?: string | null;

  @IsOptional()
  @IsInt({ message: 'Horas estimadas devem ser um número inteiro' })
  @Min(0, { message: 'Horas estimadas não podem ser negativas' })
  @Max(PROJECT_LIMITS.estimatedHoursMax, { message: `Horas estimadas devem ser no máximo ${PROJECT_LIMITS.estimatedHoursMax}` })
  estimatedHours?: number;

  @IsOptional()
  @IsString()
  @Matches(HEX_COLOR, { message: 'Cor deve ser um hex válido (#RRGGBB)' })
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(PROJECT_LIMITS.testUrl, { message: `A URL de teste deve ter no máximo ${PROJECT_LIMITS.testUrl} caracteres` })
  testUrl?: string | null;

  @IsOptional()
  @IsString()
  avatar?: string | null;

  /** Ignorado na criação — gerenciado via endpoint próprio */
  @IsOptional()
  @IsArray()
  developerIds?: string[];

  /** Ignorado na criação — começa em 0 */
  @IsOptional()
  @IsNumber()
  actualHours?: number;

  /** Ignorado na criação — começa em 0 */
  @IsOptional()
  @IsNumber()
  progress?: number;
}
