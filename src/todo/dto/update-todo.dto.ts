import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, ValidateIf } from 'class-validator';

export class UpdateTodoDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title should not be empty' })
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the todo item',
    required: false,
    type: String,
  })
  @ValidateIf((o) => !o.description && !o.status) // Validate if description and status are both empty
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @ApiProperty({
    example: 'Buy milk, eggs, and bread',
    description: 'The description of the todo item',
    required: false,
    type: String,
  })
  @ValidateIf((o) => !o.title && !o.status) // Validate if title and status are both empty
  description?: string;

  @IsBoolean({ message: 'Status must be a boolean value' })
  @ApiProperty({
    example: true,
    description: 'The status of the todo item',
    required: false,
    type: Boolean,
  })
  @ValidateIf((o) => !o.title && !o.description) // Validate if title and description are both empty
  status?: boolean;
}
