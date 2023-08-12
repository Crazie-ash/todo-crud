import { User } from '../entities/user.entity';

export interface CreateUserResponse {
  message: string;
  data: User;
}
