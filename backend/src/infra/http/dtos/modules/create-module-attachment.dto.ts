import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { LIMITS } from '../field-limits';

export class CreateModuleAttachmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITS.attachment.name)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(LIMITS.attachment.type)
  type: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number;

  @IsString()
  @IsNotEmpty()
  dataUrl: string;
}
