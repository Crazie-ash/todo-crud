import { Injectable, NotFoundException, InternalServerErrorException, HttpException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoRepository } from './todo.repository';
import { UpdateTodoDto } from 'src/todo/dto/update-todo.dto';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private todoRepository: TodoRepository,
    ) { }
    async getAllTodos(
        page: number = 1,
        limit: number = 10,
        sortBy: string = 'updated_at',
        sortOrder: 'ASC' | 'DESC' = 'DESC',
        search: string = '',
    ): Promise<Todo[]> {
        const options: FindManyOptions<Todo> = {
            take: limit,
            skip: (page - 1) * limit,
            order: { [sortBy]: sortOrder },
            where: search
                ? [
                    { title: Like(`%${search}%`) },
                    { description: Like(`%${search}%`) },
                ]
                : {},
        };
        return this.todoRepository.find(options);
    }

    async getTodoById(id: number): Promise<Todo> {
        const options: FindOneOptions<Todo> = {
            where: { id },
        };
        try {
            const todo = await this.todoRepository.findOne(options);
            if (!todo) {
                throw new NotFoundException(`Todo with id ${id} not found`);
            }
            return todo;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to get todo by id');
        }
    }

    async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
        try {
            const { title } = createTodoDto;
            const existingTodo = await this.todoRepository.findOne({ where: { title } });
            if (existingTodo) {
                throw new ConflictException('A Todo with the same title already exists.');
            }
            const todo = this.todoRepository.create(createTodoDto);
            return await this.todoRepository.save(todo);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException('Failed to create a todo');
            }
        }
    }

    async updateTodo(
        id: number,
        updateTodoDto: UpdateTodoDto,
    ): Promise<Todo> {
        try {
            await this.todoRepository.update(id, updateTodoDto);
            return this.getTodoById(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to update a todo');
        }
    }

    async deleteTodo(id: number): Promise<void> {
        try {
            await this.todoRepository.delete(id);
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete a todo');
        }
    }
}
