import { Model } from './Model';
import { Timestamps } from './Timestamps';

export interface Hospital extends Model, Timestamps {
  name: string;
  description: string;
  contact: Contact;
  address: Address;
}

interface Address {
  city: string;
  country?: string;
  street: string;
  postalCode: string;
  state?: string;
  location: number[] | Location;
}

interface Location {
  type: 'Point';
  coordinates: number[];
}

interface Contact {
  phoneNumbers?: string[];
  web?: string;
}
