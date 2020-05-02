import { BedRepository } from '../db/repository/BedRepository';
import { HospitalRepository } from '../db/repository/HospitalRepository';
import { Bed } from '../interfaces/models/Bed';
import { ModelNotFoundError } from '../error/ModelNotFoundError';
import { Hospital } from '../interfaces/models/Hospital';
import { BedValidation } from '../validation/business/BedValidation';
import { BedAlreadyOccupiedError } from '../error/BedAlreadyOccupiedError';
import { ReservationRequest } from '../interfaces/requests/ReservationRequest';
import { BedReservationError } from '../error/BedReservationError';

export class BedService {
  protected repository: BedRepository;

  protected hospitalRepository: HospitalRepository;

  constructor() {
    this.repository = new BedRepository();
    this.hospitalRepository = new HospitalRepository();
  }

  async create(data: Partial<Bed>): Promise<Bed> {
    const hospital: Hospital | null = await this.hospitalRepository.findById(
      data.hospital as string
    );

    if (!hospital) {
      throw new ModelNotFoundError('hospital', data.hospital as string);
    }

    const validator: BedValidation = new BedValidation();
    validator.validate(data);

    // @ts-ignore
    return this.repository.create(data);
  }

  protected async exists(id: string): Promise<Bed> {
    const bed: Bed | null = await this.repository.findById(id);

    if (!bed) {
      throw new ModelNotFoundError('bed', id);
    }

    return bed;
  }

  async update(id: string, update: Partial<Bed>): Promise<Bed> {
    const validator: BedValidation = new BedValidation();
    validator.validate(update);

    const bed: Bed | null = await this.repository.update(id, update);

    if (!bed) {
      throw new ModelNotFoundError('bed', id);
    }

    return bed;
  }

  async show(id: string): Promise<Bed> {
    return this.exists(id);
  }

  async delete(id: string): Promise<void> {
    await this.exists(id);
    await this.repository.delete(id);
  }

  async block(id: string): Promise<Bed> {
    const bed: Bed = await this.exists(id);

    if (!bed.isAvailable) {
      throw new BedAlreadyOccupiedError(id);
    }

    return this.repository.update(id, { isAvailable: false }) as Promise<Bed>;
  }

  async unblock(id: string): Promise<Bed> {
    await this.exists(id);

    return this.repository.update(id, { isAvailable: true }) as Promise<Bed>;
  }

  // TODO: reservation
  async reserve(req: ReservationRequest): Promise<Bed> {
    const beds: Bed[] = await this.repository.find({
      hospital: req.hospital,
      station: req.station,
      isHighCare: req.isHighCare || false,
      hasEcmo: req.hasEcmo || false,
    });

    if (beds.length === 0) {
      throw new BedReservationError(
        'There is no bed, which fits your conditions to reserve.'
      );
    }

    // TODO: check business logic
    const bed: Bed = beds[0];

    return this.repository.update(bed._id!.toString(), {
      reservedUntil: req.reservedUntil,
      isReserved: true,
    }) as Promise<Bed>;
  }
}
