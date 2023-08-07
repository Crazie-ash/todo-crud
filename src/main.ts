import { ValidationPipe, BadRequestException, ValidationError, HttpStatus, INestApplication, ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception instanceof BadRequestException ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = (exception.message || exception.response.message) || 'Internal Server Error';
    res.status(status).json({ message });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use validation pipe to validate request payloads
  app.useGlobalPipes(new ValidationPipe(
    {
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(error => Object.values(error.constraints));
        throw new BadRequestException({ message: messages.flat()});
      },
    }
  ));

  // Handle global application errors using the custom filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Setup Swagger document
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('API for managing Todo items')
    .setVersion('1.0')
    .addTag('todos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
