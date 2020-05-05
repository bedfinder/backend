import { Validatable } from '../../interfaces/validation/Validatable';
import { Bed } from '../../interfaces/models/Bed';
import { ReservationRequest } from '../../interfaces/requests/ReservationRequest';
// @ts-ignore
import moment from 'moment';
import { BedReservationError } from '../../error/BedReservationError';

/**
 * Todo:
 *
 * clarify what reservation exactly means
 * - do we need to know the start time?
 * - is reservation also connected to availability?
 * ...
 */
export class BedReservationValidation implements Validatable<Bed> {
  validate(item: Bed | Partial<Bed>, request: ReservationRequest): void {
    // bed is not available at all
    if (!item.isAvailable && !item.isReserved) {
      throw new BedReservationError(
        'Bed cannot be reserved, because it is unavailable for an unknown time.'
      );
    }
    // reservation is unknown
    if (item.isAvailable && item.isReserved && !item.reservedUntil) {
      throw new BedReservationError(
        'Bed cannot be reserved, because it is reserved for an unknown time.'
      );
    }
    // reservation is known
    if (
      item.reservedUntil &&
      moment(item.reservedUntil).isSameOrAfter(request.reservedUntil)
    ) {
      throw new BedReservationError(
        'Bed cannot be reserved, because your requests exceeds the reservation time.'
      );
    }
  }
}
