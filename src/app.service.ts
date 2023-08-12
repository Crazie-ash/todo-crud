import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { POSTGRES_HOST, DEFAULT_POSTGRES_HOST } from './constants/database.constants';
import { DEFAULT_JWT_SECRET, JWT_SECRET } from './constants/auth.constants';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) { }

  getHello(): string {
    const databaseHost = this.configService.get<string>(POSTGRES_HOST, DEFAULT_POSTGRES_HOST);
    const jwtSecret = this.configService.get<string>(JWT_SECRET, DEFAULT_JWT_SECRET);

    // console.log(`Database Host: ${databaseHost}, JWT Secret: ${jwtSecret}`);
    return 'Hello World!';
  }
}
