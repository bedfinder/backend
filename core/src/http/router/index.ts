import * as express from 'express';
import { MetaRouter } from './MetaRouter';
import { HospitalRouter } from './HospitalRouter';
import { Serverable } from '../../interfaces/http/Serverable';

export class Router {
  constructor(server: Serverable) {
    const router: express.Router = express.Router();
    server.app.use('/', new MetaRouter().getRouter());
    server.app.use('/v1/hospitals', new HospitalRouter().getRouter());
    server.app.use(router);
  }
}
