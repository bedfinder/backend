import { Document } from 'mongoose';
import { Bed } from '../../interfaces/models/Bed';
import { bedSchema } from '../scheme/BedSchema';
import { MongooseRepository } from './MongooseRepository';

export class BedRepository extends MongooseRepository<Bed & Document> {
  constructor() {
    super(bedSchema);
  }
}
