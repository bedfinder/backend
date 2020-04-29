import express from 'express';
import { ObjectIdMiddleware } from './ObjectIdMiddleware';

export function hasValidId(
  resource: string,
  idName: string | undefined = undefined
): (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void {
  const middleware: ObjectIdMiddleware = new ObjectIdMiddleware();

  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    return middleware.handle(req, res, next, resource, idName);
  };
}
