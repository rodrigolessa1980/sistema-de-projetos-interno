import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class ReorderQueueDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  orderedIds: string[];
}
