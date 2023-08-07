import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { AtLeastOneRequired } from '../../validators/at-least-one-required.validator';

export class UpdateTodoDto {
  @AtLeastOneRequired()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title should not be empty' })
  title?: string;

  @AtLeastOneRequired()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @AtLeastOneRequired()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status?: boolean;
}