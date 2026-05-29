import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TaskStatus, TimeLogSource } from '../../../../core/domain/entities/enums';

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
  description: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsEnum(TimeLogSource)
  source?: TimeLogSource;

  @IsEnum(TaskStatus)
  status: TaskStatus;
}
