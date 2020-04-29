import { Model } from './Model';
import { Timestamps } from './Timestamps';

export interface Bed extends Model, Timestamps {
  position: Position;
  isHighCare: boolean;
  hasEcmo: boolean;
  isAvailable: boolean;
  isReserved: boolean;
  reservedUntil: Date | string;
}

interface Position {
  station: string;
  room: string;
  floor: string;
  location: string;
}
