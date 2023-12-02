import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import config from '../../config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log('cause exception: ', exception?.cause);
    console.log('exception: ', exception);

    if (!(exception instanceof HttpException)) {

      response.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
      });
      return;
    }

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'object' && Object.hasOwn(exceptionResponse, 'success')) {
      return response.status(status).json(exceptionResponse);
    }

    if (status === 404) {
      return response.status(status).json({
        success: false,
        message: config.constants.API.ERRORS[404],
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
