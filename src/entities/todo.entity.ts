import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Todo {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the todo item',
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Buy groceries',
    description: 'The title of the todo item',
    type: String,
  })
  @Column()
  title: string;

  @ApiProperty({
    example: 'Buy milk, eggs, and bread',
    description: 'The description of the todo item',
    type: String,
  })
  @Column()
  description: string;

  @ApiProperty({
    example: false,
    description: 'The status of the todo item (true for completed, false for not completed)',
    type: Boolean,
  })
  @Column({ default: false })
  status: boolean;

  @ApiProperty({
    example: '2023-08-07T10:15:30Z',
    description: 'The timestamp when the todo item was created',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({
    example: '2023-08-07T15:30:00Z',
    description: 'The timestamp when the todo item was last updated',
    type: String,
    format: 'date-time',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
