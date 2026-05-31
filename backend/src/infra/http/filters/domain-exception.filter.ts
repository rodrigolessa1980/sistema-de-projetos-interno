import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../../../core/domain/exceptions/domain.exception';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      response.status(status).json(body);
      return;
    }

    if (exception instanceof DomainException) {
      const statusMap: Record<string, HttpStatus> = {
        NOT_FOUND: HttpStatus.NOT_FOUND,
        UNAUTHORIZED: HttpStatus.UNAUTHORIZED,
        CONFLICT: HttpStatus.CONFLICT,
      };
      const status = statusMap[exception.code] ?? HttpStatus.BAD_REQUEST;
      response.status(status).json({
        statusCode: status,
        code: exception.code,
        message: exception.message,
      });
      return;
    }

    this.logger.error(
      `Unhandled exception on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: exception instanceof Error ? exception.message : 'Internal server error',
    });
  }
}
