import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DependencyType } from '../../../../core/domain/entities/enums';

export class CreateTaskDependencyDto {
  @IsString()
  @IsNotEmpty()
  dependsOnTaskId: string;

  @IsOptional()
  @IsEnum(DependencyType)
  type?: DependencyType;
}
