import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProjectStatus } from '../../../core/domain/entities/enums';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsOptional()
  @IsInt()
  estimatedHours?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
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
