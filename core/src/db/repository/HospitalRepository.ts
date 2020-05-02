import { Document } from 'mongoose';
import { Hospital } from '../../interfaces/models/Hospital';
import { hospitalSchema } from '../scheme/HospitalSchema';
import { MongooseRepository } from './MongooseRepository';

export class HospitalRepository extends MongooseRepository<
  Hospital & Document
> {
  constructor() {
    super(hospitalSchema);
  }

  async findByPostalCodeAndCity(
    postalCode: string,
    city: string,
    limit = 10
  ): Promise<Array<Hospital & Document>> {
    return this.model
      .find({ 'address.postalCode': postalCode, 'address.city': city })
      .limit(limit)
      .exec();
  }

  async findWithinDistance(
    lat: number,
    lng: number,
    distance = 30,
    limit = 10
  ): Promise<Hospital[]> {
    return this.model
      .aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [lat, lng] },
            distanceField: 'distance',
            distanceMultiplier: 0.001,
            spherical: true,
            maxDistance: distance * 1000,
          },
        },
        { $sort: { distance: 1 } },
        { $limit: limit },
      ])
      .exec() as Hospital[];
  }
}
