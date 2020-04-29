import { Hospital } from '../src/interfaces/models/Hospital';

export function createHospital(): Hospital {
  return {
    name: 'Hospital',
    description: 'Hospital Description',
    contact: {
      web: 'https://example-hospital.com',
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
