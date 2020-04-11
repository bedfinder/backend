import { Router, json, urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { respond } from './response';

const _middlewareRouter = Router();

_middlewareRouter.use(json({ limit: '50mb' }));
_middlewareRouter.use(urlencoded({ limit: '20mb', extended: true }));
_middlewareRouter.use(helmet());
_middlewareRouter.use(cors());

_middlewareRouter.all('/__internal/health', (_, res) => {
  respond(res, { timestamp: Date.now() }, 200);
});

export const middlewareRouter = _middlewareRouter;
