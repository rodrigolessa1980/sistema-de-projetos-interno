import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskStatus } from '../../../../core/domain/entities/enums';

export class ReorderKanbanTasksDto {
  @IsString()
  taskId: string;

  @IsEnum(TaskStatus)
  targetStatus: TaskStatus;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  targetTaskIds: string[];

  @IsOptional()
  @IsEnum(TaskStatus)
  sourceStatus?: TaskStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sourceTaskIds?: string[];
}
