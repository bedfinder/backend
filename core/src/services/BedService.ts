import { BedRepository } from '../db/repository/BedRepository';

export class BedService {
  protected repository: BedRepository;

  constructor() {
    this.repository = new BedRepository();
  }
}
