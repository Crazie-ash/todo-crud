import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the todo item',
    type: String,
  })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    example: 'Buy milk, eggs, and bread',
    description: 'The description of the todo item',
    type: String,
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  userId: number;
}
