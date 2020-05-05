import * as express from 'express';
import { hasValidId } from '../middleware';
import { bc } from '../controller/BedController';

export class BedRouter {
  router: express.Router;

  constructor() {
    this.router = express.Router();
    this.routes();
  }

  routes(): void {
    this.router.post('/', bc.create);
    this.router.patch('/:id', hasValidId('bed'), bc.update);
    this.router.patch('/:id/block', hasValidId('bed'), bc.block);
    this.router.patch('/:id/unblock', hasValidId('bed'), bc.unblock);
    this.router.get('/:id', hasValidId('bed'), bc.show);
    this.router.delete('/:id', hasValidId('bed'), bc.delete);
  }

  getRouter(): express.Router {
    return this.router;
  }
}
