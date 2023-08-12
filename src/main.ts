import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validationPipeConfig } from './pipes/validation.pipe';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { setupSwagger } from './config/swagger.config';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(validationPipeConfig);
  app.useGlobalFilters(new GlobalExceptionFilter());
  
  setupSwagger(app);

  await app.listen(3000);
}

bootstrap();
