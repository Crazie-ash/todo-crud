import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from '../entities/todo.entity';
import { NotFoundException } from '@nestjs/common';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            getAllTodos: jest.fn(),
            createTodo: jest.fn(),
            getTodoById: jest.fn(), 
            updateTodo: jest.fn(),
            deleteTodo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  describe('getAllTodos', () => {
    it('should return an array of todos', async () => {
      const mockTodos: Todo[] = [
        { 
          id: 1, 
          title: 'Task 1', 
          description: 'Task Description 1', 
          userId: 1,
          status: false,
          created_at: new Date(),
          updated_at: new Date()
        },
        { 
          id: 2, 
          title: 'Task 2', 
          description: 'Task Description 2', 
          userId: 1,
          status: true,
          created_at: new Date(),
          updated_at: new Date()
        },
      ];
      
      const mockRequest = {
        user: { id: 1 },
      };
      jest.spyOn(service, 'getAllTodos').mockResolvedValue({ message: 'Todos retrieved successfully', data: mockTodos });

      const result = await controller.getAllTodos(mockRequest, 1, 10, 'updated_at', 'DESC', 'sample');

      expect(result).toEqual({ message: 'Todos retrieved successfully', data: mockTodos });
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'New Task',
        description: 'New Task Description',
        userId: 1,
      };

      const userId = 1;

      const mockCreatedTodo: Todo = {
        id: 1,
        title: createTodoDto.title,
        description: createTodoDto.description,
        userId: 1,
        status: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'createTodo').mockResolvedValue({ message: 'Todo created successfully', data: mockCreatedTodo });

      const result = await controller.createTodo(createTodoDto, { user: { id: userId } });

      expect(result).toEqual({ message: 'Todo created successfully', data: mockCreatedTodo });
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const id = 1;
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Task',
        description: 'Updated Task Description',
      };
  
      const userId = 1;
  
      const existingTodo: Todo = {
        id: id,
        title: 'Old Task',
        description: 'Old Task Description',
        userId: userId,
        status: false,
        created_at: new Date(),
        updated_at: new Date(),
      };
  
      const mockUpdatedTodo: Todo = {
        id: id,
        title: updateTodoDto.title,
        description: updateTodoDto.description,
        userId: userId,
        status: true,
        created_at: existingTodo.created_at,
        updated_at: new Date(),
      };
  
      jest.spyOn(service, 'getTodoById').mockResolvedValue({ message: 'Todo retrieved successfully', data: existingTodo });
      jest.spyOn(service, 'updateTodo').mockResolvedValue({ message: 'Todo updated successfully', data: mockUpdatedTodo });
  
      const result = await controller.updateTodo(id, updateTodoDto, { user: { id: userId } });
  
      expect(result).toEqual({ message: 'Todo updated successfully', data: mockUpdatedTodo });
    });
  
    it('should throw NotFoundException for nonexistent todo', async () => {
      jest.spyOn(service, 'getTodoById').mockResolvedValue(null);
  
      await expect(controller.updateTodo(1, {}, { user: { id: 1 } })).rejects.toThrow(NotFoundException);
    });
  });
  

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const id = 1;

      jest.spyOn(service, 'deleteTodo').mockResolvedValue({ message: 'Todo deleted successfully' });

      const result = await controller.deleteTodo(id, { user: { id: 1 } });

      expect(result).toEqual({ message: 'Todo deleted successfully' });
    });

    it('should throw NotFoundException for nonexistent todo', async () => {
      jest.spyOn(service, 'deleteTodo').mockRejectedValue(new NotFoundException());

      await expect(controller.deleteTodo(1, { user: { id: 1 } })).rejects.toThrow(NotFoundException);
    });
  });
});
