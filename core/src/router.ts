import { Router } from 'express';
import { cdnRouter } from './cdn/router';

const _router = Router();

_router.use('/cdn', cdnRouter);

export const router = _router;
