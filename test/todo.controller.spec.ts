import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from '../src/todo/todo.controller';
import { TodoService } from '../src/todo/todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from '../src/entities/todo.entity';
import { Repository } from 'typeorm';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  describe('getAllTodos', () => {
    it('should return an array of Todo items', async () => {
      const result = [{ id: 1, title: 'Todo 1', description: 'Description 1', status: false }];
      jest.spyOn(service, 'getAllTodos').mockImplementation(() => Promise.resolve(result));

      expect(await controller.getAllTodos()).toEqual(result);
    });
  });

});
