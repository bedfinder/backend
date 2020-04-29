import { ValidationError as JoiValidationError } from '@hapi/joi';
import { ApiError } from './ApiError';

export class ValidationError extends ApiError {
  protected errors: JoiValidationError;

  constructor(errors: JoiValidationError, errorCode = -1) {
    super('Unprocessable entity.', 422, errorCode);
    this.errors = errors;
  }

  getMessages(): JoiValidationError {
    return this.errors;
  }
}
