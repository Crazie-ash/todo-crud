import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BadRequestException, ConflictException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as exceptionConstants from 'src/constants/exception.constants';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exceptionConstants.DEFAULT_ERROR_MESSAGE;

    if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message || exceptionConstants.BAD_REQUEST_MESSAGE;
    } else if (exception instanceof ConflictException) {
      status = HttpStatus.CONFLICT;
      message = exception.message || exceptionConstants.CONFLICT_MESSAGE;
    } else if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message || exceptionConstants.UNAUTHORIZED_MESSAGE;
    } else if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message || exceptionConstants.FORBIDDEN_MESSAGE;
    }
    res.status(status).json({ message });
  }
}
