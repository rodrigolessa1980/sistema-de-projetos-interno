import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { TaskStatus, TimeLogSource } from '../../../../core/domain/entities/enums';
import { LIMITS } from '../field-limits';

export class CreateTimeLogDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsNumber()
  @Min(0.01)
  hours: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITS.timeLog.description, { message: `A descrição deve ter no máximo ${LIMITS.timeLog.description} caracteres` })
  description: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsEnum(TimeLogSource)
  source?: TimeLogSource;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
