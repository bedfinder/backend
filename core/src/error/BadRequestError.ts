import { ApiError } from './ApiError';

export class BadRequestError extends ApiError {
  constructor(msg: string, errorCode = -1) {
    super(msg, 400, errorCode);
  }
}
