import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskNoteDto {
  @IsString()
  @IsNotEmpty({ message: 'A anotação não pode ser vazia' })
  content: string;
}

export class UpdateTaskNoteDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
