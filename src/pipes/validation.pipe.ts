import { ValidationPipe, BadRequestException, ValidationError } from '@nestjs/common';

export const validationPipeConfig = new ValidationPipe({
  exceptionFactory: (errors: ValidationError[]) => {
    const messages = errors.map(error => Object.values(error.constraints));
    throw new BadRequestException({ message: messages.flat()});
  },
});
