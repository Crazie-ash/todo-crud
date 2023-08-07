import { Injectable, NotFoundException, InternalServerErrorException, HttpException, ConflictException, ForbiddenException } from '@nestjs/common';
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
        userId?: number, // Include userId parameter to get todos associated with a specific user
    ): Promise<any> {
        const options: FindManyOptions<Todo> = {
            take: limit,
            skip: (page - 1) * limit,
            order: { [sortBy]: sortOrder },
            where: {
                ...(search
                    ? {
                        title: Like(`%${search}%`),
                        description: Like(`%${search}%`),
                    }
                    : {}),
                userId: userId, // Filter todos by userId if provided
            },
        };
        const todos = await this.todoRepository.find(options);
        return { message: 'Successfully retrieved todos', data: todos };
    }

    async getTodoById(id: number): Promise<any> {
        const options: FindOneOptions<Todo> = {
            where: { id },
        };
        try {
            const todo = await this.todoRepository.findOne(options);
            if (!todo) {
                throw new NotFoundException(`Todo with id ${id} not found`);
            }
            return { message: 'Successfully retrieved a todo', data: todo };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('Something went wrong!');
        }
    }

    async createTodo(createTodoDto: CreateTodoDto, userId?: number): Promise<any> {
        try {
            const { title } = createTodoDto;
            const existingTodo = await this.todoRepository.findOne({ where: { title, userId } });
            if (existingTodo) {
                throw new ConflictException('A Todo with the same title already exists.');
            }

            createTodoDto.userId = userId;

            const todo = this.todoRepository.create(createTodoDto);
            const createdTodo = await this.todoRepository.save(todo);
            return { message: 'Todo created successfully', data: createdTodo };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException('Something went wrong!');
            }
        }
    }

    async updateTodo(
        id: number,
        updateTodoDto: UpdateTodoDto,
        userId?: number, // Include userId parameter to check if the todo belongs to the user
    ): Promise<any> {
        try {
            const todo = await this.getTodoById(id);
            if (!todo) {
                throw new NotFoundException(`Todo with id ${id} not found`);
            }

            if (userId && todo.data.userId !== userId) {
                throw new ForbiddenException('You do not have permission to update this todo.');
            }

            await this.todoRepository.update(id, updateTodoDto);

            return { message: 'Todo updated successfully', data: todo.data };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException('Something went wrong!');
        }
    }

    async deleteTodo(id: number, userId?: number): Promise<any> {
        try {
            const todo = await this.getTodoById(id);
            if (!todo) {
                throw new NotFoundException(`Todo with id ${id} not found`);
            }

            if (userId && todo.data.userId !== userId) {
                throw new ForbiddenException('You do not have permission to delete this todo.');
            }

            const result = await this.todoRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Todo with id ${id} not found`);
            }
            return { message: 'Todo deleted successfully' };
        } catch (error) {
            throw new InternalServerErrorException('Something went wrong!');
        }
    }
}
