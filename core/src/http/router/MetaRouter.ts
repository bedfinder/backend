import * as express from 'express';
import { respond } from '../response';

export class MetaRouter {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  routes(): void {
    this.router.get('/', (req: express.Request, res: express.Response) => {
      return res.sendStatus(200);
    });
    this.router.get(
      '/health',
      (req: express.Request, res: express.Response): express.Response => {
        return respond(res, { running: true, uptime: process.uptime() });
      }
    );
    this.router.get(
      '/version',
      (req: express.Request, res: express.Response) => {
        return respond(res, {
          version: require('../../../package.json').version,
        });
      }
    );
  }

  getRouter(): express.Router {
    return this.router;
  }
}
