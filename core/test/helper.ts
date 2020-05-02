import { Hospital } from '../src/interfaces/models/Hospital';
import { Bed } from '../src/interfaces/models/Bed';

export function createHospital(): Partial<Hospital> {
  return {
    name: 'Hospital',
    description: 'Hospital Description',
    contact: {
      web: 'https://example-hospital.com',
      phoneNumbers: [],
    },
    address: {
      city: 'Rostock',
      state: 'MV',
      street: 'Südring 81',
      postalCode: '18059',
      location: {
        type: 'Point',
        coordinates: [54.07607, 12.11977],
      },
    },
  };
}

export function createBed(
  hospital: string,
  props?: Partial<Bed>
): Partial<Bed> {
  return {
    hospital,
    position: {
      floor: '1',
      station: 'IS',
      room: '42',
    },
    ...props,
  };
}
