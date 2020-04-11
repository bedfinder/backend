/**
 * This is the entry point for the sonamedic api service
 */
require('dotenv').config();

import express from 'express';
import { middlewareRouter } from './utils/middlewares';
import { log } from './utils/logging';
import { router } from './router';
import { errorHandler } from './utils/errorHandling';
import { respond } from './utils/response';

const _app = express();
const PORT = process.env.PORT || 3000;

/** Middlewares */
_app.use(middlewareRouter);

/** Routes */
_app.use(router);

/** 404s */
_app.all('*', ({ res }) => respond(res!, {}, 404));

/** Error Handling */
_app.use(errorHandler);
_app.listen(PORT, () => {
  log.info(`🚀 Running on ${PORT}. Heavy shit.`);
});

// Only for test purposes
export const app = _app;
