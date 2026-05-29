import { IsNotEmpty, IsString } from 'class-validator';

export class StopTimerDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
