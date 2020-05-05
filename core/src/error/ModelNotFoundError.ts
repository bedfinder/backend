import { ApiError } from './ApiError';

export class ModelNotFoundError extends ApiError {
  constructor(resource: string, id: string, errorCode = -1) {
    super(
      `The requested model ${resource} ${id} could not be found.`,
      404,
      errorCode
    );
  }
}
