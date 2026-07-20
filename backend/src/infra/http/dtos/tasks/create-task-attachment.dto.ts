import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTaskAttachmentDto {
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
