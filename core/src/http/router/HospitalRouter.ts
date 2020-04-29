import * as express from 'express';
import { hc } from '../controller/HospitalController';
import { hasValidId } from '../middleware';

export class HospitalRouter {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  routes(): void {
    this.router.get('/', hc.index);
    this.router.post('/', hc.create);
    this.router.get('/:id', hasValidId('hospital'), hc.show);
    this.router.delete('/:id', hasValidId('hospital'), hc.delete);
  }

  getRouter(): express.Router {
    return this.router;
  }
}
