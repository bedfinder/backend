import { BadRequestError } from './BadRequestError';

export class BedReservationError extends BadRequestError {
  constructor(msg: string, errorCode = -1) {
    super(msg, errorCode);
  }
}
