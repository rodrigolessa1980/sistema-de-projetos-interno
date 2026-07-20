import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'O comentário não pode ser vazio' })
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'O comentário não pode ser vazio' })
  content: string;
}
