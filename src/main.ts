import { ValidationPipe, BadRequestException, ValidationError, HttpStatus, INestApplication, ExceptionFilter, Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof BadRequestException) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message || 'Bad Request';
    } else if (exception instanceof ConflictException) {
        status = HttpStatus.CONFLICT;
        message = exception.message || 'Conflict';
    }
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
