import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import { CreateUserResponse } from './user.response';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };

      const mockUser: User = {
        id: 1, 
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
      };

      const createdUser: CreateUserResponse = {
        message: 'User created successfully',
        data: mockUser,
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);

      const result = await userController.createUser(createUserDto);

      expect(result).toEqual(createdUser);
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getAllUsers', () => {
    it('should return a list of users', async () => {
      const mockUsers:User[] = [
        { id: 1, username: 'user1', email: 'user1@example.com', password: 'password1' },
        { id: 2, username: 'user2', email: 'user2@example.com', password: 'password2' },
      ];

      jest.spyOn(userService, 'findAllUsers').mockResolvedValue(mockUsers);

      const result = await userController.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(userService.findAllUsers).toHaveBeenCalled();
    });
  });
});
