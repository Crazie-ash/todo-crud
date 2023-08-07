import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'todo_db',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  synchronize: true, // set to false in production
};

export default typeOrmConfig;
