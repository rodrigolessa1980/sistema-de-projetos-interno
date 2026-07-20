import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty({ message: 'A subtarefa precisa de um título' })
  title: string;

  @IsOptional()
  @IsString()
  assigneeId?: string | null;
}

export class UpdateSubtaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  assigneeId?: string | null;
}
