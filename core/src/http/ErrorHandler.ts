import * as express from 'express';
import { logger } from '../utils/logging';
import { ApiError } from '../error/ApiError';
import { respond } from './response';
import { Serverable } from '../interfaces/http/Serverable';
import { ValidationError } from '../error/ValidationError';

export class ErrorHandler {
  static init(server: Serverable): void {
    // !!! don't remove next!!!
    server.app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ): express.Response => {
        if (err instanceof ValidationError) {
          logger.error(err.getMessage(), {
            code: err.getCode(),
            meta: err.getMessages(),
            status: err.getStatus(),
          });

          return respond(
            res,
            {
              name: err.getName(),
              message: err.getMessage(),
              code: err.getCode(),
              errors: err.getMessages(),
            },
            422
          );
        }

        if (err instanceof ApiError) {
          logger.error(err.getMessage(), {
            code: err.getCode(),
            meta: err.getMeta(),
            status: err.getStatus(),
          });

          return respond(
            res,
            {
              name: err.getName(),
              message: err.getMessage(),
              code: err.getCode(),
            },
            err.getStatus()
          );
        }

        logger.error(err.stack!, { code: -1, status: 500 });
        if (process.env.NODE_ENV === 'production') {
          return respond(
            res,
            {
              name: 'InternalServerError',
              message: 'Internal Server Error',
              code: -1,
            },
            500
          );
        }

        return respond(
          res,
          {
            name: 'InternalServerError',
            message: err.message,
            code: -1,
            meta: err.stack,
          },
          500
        );
      }
    );
  }
}
