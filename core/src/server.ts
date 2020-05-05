import express from 'express';
import { ErrorHandler } from './http/ErrorHandler';
import { Serverable } from './interfaces/http/Serverable';
import { ServerConfiguration } from './http/config/ServerConfiguration';
import { Router } from './http/router';

export class Server implements Serverable {
  app!: express.Application;

  init(): void {
    this.app = express();
    new ServerConfiguration(this);
    new Router(this);

    // IMPORTANT: MUST BE LAST
    ErrorHandler.init(this);
  }
}
