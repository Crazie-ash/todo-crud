import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createUser(createUserDto: CreateUserDto): Promise<any> {
        try {

            const existingUser = await this.userRepository
            .createQueryBuilder('user')
            .where('user.email = :email OR user.username = :username', {
                email: createUserDto.email,
                username: createUserDto.username,
            })
            .getOne();
            if (existingUser) {
                throw new ConflictException('User with this email or username already exists');
            }

            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const user = this.userRepository.create({ ...createUserDto, password: hashedPassword });
            const createdUser = this.userRepository.save(user);
            return { message: 'User created successfully', data: createdUser };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            } else {
                throw new InternalServerErrorException('Something went wrong!');
            }
        }
    }


    async findByUsername(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }

    async findByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User | undefined> {
        const options: FindOneOptions<User> = {
            where: { id },
        };
        return this.userRepository.findOne(options);
    }

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
}
