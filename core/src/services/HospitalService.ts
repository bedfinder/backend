import { HospitalRepository } from '../db/repository/HospitalRepository';
import { Hospital } from '../interfaces/models/Hospital';
import { ModelNotFoundError } from '../error/ModelNotFoundError';
import { LocationCriteria } from '../interfaces/http/criteria/LocationCriteria';
import { PostalCodeCityCriteria } from '../interfaces/http/criteria/PostalCodeCityCriteria';
import { PaginationCriteria } from '../interfaces/http/criteria/PaginationCriteria';
import { Pagination } from '../interfaces/Pagination';

export class HospitalService {
  protected repository: HospitalRepository;

  constructor() {
    this.repository = new HospitalRepository();
  }

  async index(
    criteria:
      | LocationCriteria
      | PostalCodeCityCriteria
      | PaginationCriteria
      | unknown
  ): Promise<Hospital[] | Pagination<Hospital>> {
    if (criteria instanceof LocationCriteria) {
      return this.repository.findWithinDistance(
        criteria.lat,
        criteria.lng,
        criteria.distance,
        criteria.limit
      );
    } else if (criteria instanceof PostalCodeCityCriteria) {
      return this.repository.findByPostalCodeAndCity(
        criteria.postalCode,
        criteria.city,
        criteria.limit
      );
    } else if (criteria instanceof PaginationCriteria) {
      return this.repository.paginate(criteria.page);
    }

    return this.repository.take();
  }

  async create(data: Partial<Hospital>): Promise<Hospital> {
    // @ts-ignore
    return this.repository.create(data);
  }

  protected async exists(id: string): Promise<Hospital> {
    const hospital: Hospital | null = await this.repository.findById(id);

    if (!hospital) {
      throw new ModelNotFoundError('hospital', id);
    }

    return hospital;
  }

  async show(id: string): Promise<Hospital> {
    return this.exists(id);
  }

  async delete(id: string): Promise<void> {
    await this.exists(id);
    await this.repository.delete(id);
  }
}
