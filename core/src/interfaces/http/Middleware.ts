import express from 'express';

export interface Middleware {
  handle(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void;
}
