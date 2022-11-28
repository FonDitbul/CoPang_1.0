import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { badRequestError, forbiddenError } from './exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = exception.getStatus();
    console.error(exception);
    if (badRequestError.includes(exception.message)) {
      status = HttpStatus.BAD_REQUEST;
    }

    if (forbiddenError.includes(exception.message)) {
      status = HttpStatus.FORBIDDEN;
    }

    return response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
