import { Injectable, NotFoundException, InternalServerErrorException, HttpException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoRepository } from './todo.repository';
import { UpdateTodoDto } from 'src/todo/dto/update-todo.dto';
import { CreateTodoResponse, DeleteTodoResponse, GetAllTodosResponse, GetTodoByIdResponse, UpdateTodoResponse } from './todo.response';
import * as todoMessages from 'src/constants/todo.constants';

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
        userId?: number,
    ): Promise<GetAllTodosResponse> {
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
                userId: userId,
            },
        };
        const todos = await this.todoRepository.find(options);
        return { message: todoMessages.TODOS_RETRIEVED_SUCCESSFULLY, data: todos };
    }

    async getTodoById(id: number): Promise<GetTodoByIdResponse> {
        const options: FindOneOptions<Todo> = {
            where: { id },
        };
        try {
            const todo = await this.todoRepository.findOne(options);
            if (!todo) {
                throw new NotFoundException(todoMessages.TODO_NOT_FOUND(id));
            }
            return { message: todoMessages.TODO_RETRIEVED_SUCCESSFULLY, data: todo };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(todoMessages.SOMETHING_WENT_WRONG);
        }
    }

    async createTodo(createTodoDto: CreateTodoDto, userId?: number): Promise<CreateTodoResponse> {
        try {
            const { title } = createTodoDto;
            const existingTodo = await this.todoRepository.findOne({ where: { title, userId } });
            if (existingTodo) {
                throw new ConflictException(todoMessages.TODO_ALREADY_EXISTS);
            }

            createTodoDto.userId = userId;

            const todo = this.todoRepository.create(createTodoDto);
            const createdTodo = await this.todoRepository.save(todo);
            return { message: todoMessages.TODO_CREATED_SUCCESSFULLY, data: createdTodo };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException(todoMessages.SOMETHING_WENT_WRONG);
            }
        }
    }

    async updateTodo(
        id: number,
        updateTodoDto: UpdateTodoDto,
        userId?: number,
    ): Promise<UpdateTodoResponse> {
        const todo = await this.getTodoById(id);
        
        if (!todo) {
            throw new NotFoundException(todoMessages.TODO_NOT_FOUND(id));
        }

        if (userId && todo.data.userId !== userId) {
            throw new ForbiddenException(todoMessages.PERMISSION_DENIED_UPDATE);
        }

        try {
            await this.todoRepository.update(id, updateTodoDto);
            const updatedTodo = { ...todo.data, ...updateTodoDto };

            return { message: todoMessages.TODO_UPDATED_SUCCESSFULLY, data: updatedTodo };
        } catch (error) {
            throw new InternalServerErrorException(todoMessages.SOMETHING_WENT_WRONG);
        }
    }

    async deleteTodo(id: number, userId?: number): Promise<DeleteTodoResponse> {
        try {
            const todo = await this.getTodoById(id);
            if (!todo) {
                throw new NotFoundException(todoMessages.TODO_NOT_FOUND(id));
            }

            if (userId && todo.data.userId !== userId) {
                throw new ForbiddenException(todoMessages.PERMISSION_DENIED_DELETE);
            }

            const result = await this.todoRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(todoMessages.TODO_NOT_FOUND(id));
            }
            return { message: todoMessages.TODO_DELETED_SUCCESSFULLY };
        } catch (error) {
            throw new InternalServerErrorException(todoMessages.SOMETHING_WENT_WRONG);
        }
    }
}
