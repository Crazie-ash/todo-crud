import {
  Controller, Post,
  Get,
  Body,
  HttpStatus
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users') 
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto, 
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists',
  })
  @ApiBody({ type: CreateUserDto }) 
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const createdUser = await this.userService.createUser(createUserDto);
    return createdUser;
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Retrieves a list of all users.' })
  @ApiResponse({
    status: 200,
    description: 'The list of users has been successfully retrieved.',
  })
  async getAllUsers(): Promise<any> {
    return this.userService.findAllUsers();
  }
}
