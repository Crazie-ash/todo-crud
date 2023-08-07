import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

export class CreateTodoDto {
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    title: string;
  
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be a string' })
    description: string;

}
