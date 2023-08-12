import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as dbConstants from '../constants/database.constants';
import * as path from 'path';

export const typeOrmConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  const entitiesPath = path.resolve(__dirname, '..', 'entities') + '/*.entity{.ts,.js}';
  return {
    type: dbConstants.DEFAULT_DATABASE_TYPE,
    host: configService.get(dbConstants.DATABASE_HOST) || dbConstants.DEFAULT_DATABASE_HOST,
    port: +configService.get(dbConstants.DATABASE_PORT) || dbConstants.DEFAULT_DATABASE_PORT,
    username: configService.get(dbConstants.DATABASE_USERNAME) || dbConstants.DEFAULT_DATABASE_USERNAME,
    password: configService.get(dbConstants.DATABASE_PASSWORD) || dbConstants.DEFAULT_DATABASE_PASSWORD,
    database: configService.get(dbConstants.DATABASE_NAME) || dbConstants.DEFAULT_DATABASE_NAME,
    entities: [entitiesPath],
    synchronize: true,
  }
};

