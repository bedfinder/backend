import { ApiError } from './ApiError';

export class BedAlreadyOccupiedError extends ApiError {
  constructor(id: string, errorCode = -1) {
    super(`The bed ${id} is already occupied.`, 400, errorCode);
  }
}
