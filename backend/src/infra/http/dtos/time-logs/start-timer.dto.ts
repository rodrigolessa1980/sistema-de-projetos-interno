import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../../../../core/domain/entities/enums';

export class StartTimerDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
