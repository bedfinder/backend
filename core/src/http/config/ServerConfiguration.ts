import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import { Serverable } from '../../interfaces/http/Serverable';

export class ServerConfiguration {
  private static allowedMethods = 'GET, POST, PUT, DELETE, OPTIONS';

  private static allowedHeaders: string =
    'Origin, X-Requested-With,' +
    'Content-Type, Accept, ' +
    'Authorization, ' +
    'Access-Control-Allow-Credentials';

  constructor(server: Serverable) {
    server.app.use(express.urlencoded({ extended: true }));
    server.app.use(express.json({ limit: '50mb' }));
    server.app.use(cookieParser());
    server.app.use(compression());
    server.app.use(helmet());
    server.app.use(cors());

    server.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header(
          'Access-Control-Allow-Methods',
          ServerConfiguration.allowedMethods
        );
        res.header(
          'Access-Control-Allow-Headers',
          ServerConfiguration.allowedHeaders
        );
        next();
      }
    );
  }
}
