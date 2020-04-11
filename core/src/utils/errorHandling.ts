import { Response, ErrorRequestHandler } from 'express';
import { Boom, internal } from '@hapi/boom';
import { boomify } from '@hapi/boom';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { log } from './logging';

type ExpressError = Error & Boom;

/**
 * Error Handling for express - using @hapi/boom for standard responses
 * @param err - Error or Boom error
 */
export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error) {
    log.error(error);
    if (!error.isBoom) {
      return res.json(boomify(error));
    }
    return res.status(error.output.statusCode).json(error.output.payload);
  } else {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json(internal('Strange error happend. We are looking into it.'));
  }
};
