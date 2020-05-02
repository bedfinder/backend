import { Validatable } from '../../interfaces/validation/Validatable';
import { Bed } from '../../interfaces/models/Bed';
import { BadRequestError } from '../../error/BadRequestError';

export class BedValidation implements Validatable<Bed> {
  validate(item: Bed | Partial<Bed>): void {
    if (!item.isHighCare && item.hasEcmo) {
      throw new BadRequestError('Only a high care bed can have an ecmo');
    }
  }
}
