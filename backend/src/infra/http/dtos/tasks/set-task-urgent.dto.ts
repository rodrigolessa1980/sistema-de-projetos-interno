import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SetTaskUrgentDto {
  @IsBoolean()
  @IsNotEmpty()
  isUrgent: boolean;
}
