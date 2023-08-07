import { Controller, Get, Param, Post, Body, Put, Delete, Query, HttpStatus, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { Todo } from '../entities/todo.entity';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('todos')
@ApiTags('todos') 
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    @Request() req, // Inject the Request object
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'updated_at',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'DESC',
    @Query('search') search?: string,
  ): Promise<any> {
    const userId = req.user.id; // Access user ID from the token
    return this.todoService.getAllTodos(page, limit, sortBy, sortOrder, search, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Request() req, // Inject the Request object
  ): Promise<any> {
    const userId = req.user.id; // Access user ID from the token
    return this.todoService.createTodo(createTodoDto, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    @Request() req, // Inject the Request object
  ): Promise<{ message: string; todo: Todo }> {
    const userId = req.user.id; // Access user ID from the token
    const todo = await this.todoService.updateTodo(id, updateTodoDto, userId);
    if (!todo) {
      throw new NotFoundException(`Todo with id ${id} not found`);
    }
    return todo;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Todo deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found' })
  async deleteTodo(
    @Param('id') id: number,
    @Request() req, // Inject the Request object
  ): Promise<any> {
    const userId = req.user.id; // Access user ID from the token
    const response = await this.todoService.deleteTodo(id, userId);
    return response;
  }
}
