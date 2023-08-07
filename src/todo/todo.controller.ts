import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Put,
    Delete,
    Query,
  } from '@nestjs/common';
  import { Todo } from '../entities/todo.entity';
  import { TodoService } from './todo.service';
  import { CreateTodoDto } from './dto/create-todo.dto';
  import { ApiQuery } from '@nestjs/swagger';

  @Controller('todos')
  export class TodoController {
    constructor(private readonly todoService: TodoService) {}
  
    @Get()
    @ApiQuery({ name: 'search', type: String, required: false })
    async getAllTodos(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'updated_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('search') search?: string,
  ): Promise<Todo[]> {
    return this.todoService.getAllTodos(page, limit, sortBy, sortOrder, search);
  }
  
    @Get(':id')
    async getTodoById(@Param('id') id: number): Promise<Todo> {
      return this.todoService.getTodoById(id);
    }
  
    @Post()
    async createTodo(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
      return this.todoService.createTodo(createTodoDto);
    }
  
    @Put(':id')
    async updateTodo(
      @Param('id') id: number,
      @Body() updateTodoDto: CreateTodoDto,
    ): Promise<Todo> {
      return this.todoService.updateTodo(id, updateTodoDto);
    }
  
    @Delete(':id')
    async deleteTodo(@Param('id') id: number): Promise<void> {
      return this.todoService.deleteTodo(id);
    }
  }
  