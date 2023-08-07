// todo.controller.ts
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Todo } from '../entities/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
@ApiTags('todos') // Add tags for the API documentation
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @ApiQuery({ name: 'sortBy', type: String, required: false, example: 'updated_at' })
  @ApiQuery({ name: 'sortOrder', enum: ['ASC', 'DESC'], required: false, example: 'DESC' })
  @ApiQuery({ name: 'search', type: String, required: false, example: 'sample' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved todos',
    isArray: true,
  })
  async getAllTodos(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'updated_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('search') search?: string,
  ): Promise<any> {
    return this.todoService.getAllTodos(page, limit, sortBy, sortOrder, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved a todo',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found' })
  async getTodoById(@Param('id') id: number): Promise<any> {
    const todo = await this.todoService.getTodoById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Todo created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A Todo with the same title already exists',
  })
  async createTodo(@Body() createTodoDto: CreateTodoDto): Promise<any> {
    return this.todoService.createTodo(createTodoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todo updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found' })
  async updateTodo(
    @Param('id') id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<{ message: string; todo: Todo }> {
    const todo = await this.todoService.updateTodo(id, updateTodoDto);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Todo deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found' })
  async deleteTodo(@Param('id') id: number): Promise<any> {
    const response = await this.todoService.deleteTodo(id);
    return response;
  }
}
