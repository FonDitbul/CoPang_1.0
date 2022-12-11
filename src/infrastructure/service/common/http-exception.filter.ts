import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { CoPangException } from '../../../domain/common/exception';

@Catch(CoPangException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: CoPangException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.getMessage();
    console.error(exception);

    const responseBody = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    console.log(responseBody);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(responseBody);
  }
}
