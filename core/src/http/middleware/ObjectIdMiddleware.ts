import express from 'express';
import { Middleware } from '../../interfaces/http/Middleware';
import mongoose from 'mongoose';
import { ModelNotFoundError } from '../../error/ModelNotFoundError';

export class ObjectIdMiddleware implements Middleware {
  handle(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
    resource?: string,
    idName?: string
  ): void {
    let id = '';

    if (idName) {
      id = req.params[idName];
    } else {
      id = req.params.id;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ModelNotFoundError(resource!, id);
    }
    next();
  }
}
