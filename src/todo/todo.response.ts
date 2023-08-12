import { Todo } from '../entities/todo.entity';

export interface GetAllTodosResponse {
  message: string;
  data: Todo[];
}

export interface GetTodoByIdResponse {
  message: string;
  data: Todo;
}

export interface CreateTodoResponse {
  message: string;
  data: Todo;
}

export interface UpdateTodoResponse {
  message: string;
  data: Todo;
}

export interface DeleteTodoResponse {
  message: string;
}
