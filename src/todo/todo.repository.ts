import { EntityRepository, Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { FindOneOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const { title, description } = createTodoDto;
    const todo = this.create({ title, description, status: false });
    return this.save(todo);
  }

  async updateTodo(id: number, updateTodoDto: CreateTodoDto): Promise<Todo> {
    const { title, description } = updateTodoDto;
    await this.update(id, { title, description });
    const findOptions: FindOneOptions<Todo> = { where: { id } };
    return this.findOne(findOptions);
  }
}
