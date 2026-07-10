import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { TaskStatus } from '../../../../core/domain/entities/enums';
import { LIMITS } from '../field-limits';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  moduleId: string;

  @IsString()
  @IsNotEmpty()
  epicId: string;

  @IsOptional()
  @IsString()
  parentTaskId?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITS.task.title, { message: `O título deve ter no máximo ${LIMITS.task.title} caracteres` })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITS.task.description, { message: `A descrição deve ter no máximo ${LIMITS.task.description} caracteres` })
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsInt()
  @Min(LIMITS.task.complexityMin, { message: `A complexidade deve ser no mínimo ${LIMITS.task.complexityMin}` })
  @Max(LIMITS.task.complexityMax, { message: `A complexidade deve ser no máximo ${LIMITS.task.complexityMax}` })
  complexity?: number;

  @IsString()
  @IsNotEmpty()
  assigneeId: string;

  @IsString()
  @IsNotEmpty()
  reporterId: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Horas estimadas não podem ser negativas' })
  @Max(LIMITS.task.estimatedHoursMax, { message: `Horas estimadas devem ser no máximo ${LIMITS.task.estimatedHoursMax}` })
  estimatedHours?: number;

  @IsOptional()
  @IsNumber()
  actualHours?: number;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  @MaxLength(LIMITS.task.blockedReason, { message: `O motivo do bloqueio deve ter no máximo ${LIMITS.task.blockedReason} caracteres` })
  blockedReason?: string | null;

  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @IsOptional()
  isUrgent?: boolean;
}
