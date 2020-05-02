import { Model } from './Model';
import { Timestamps } from './Timestamps';
import { Hospital } from './Hospital';

export interface Bed extends Model, Timestamps {
  hasEcmo: boolean;
  hospital: string | Hospital;
  position: Position;
  isHighCare: boolean;
  isAvailable: boolean;
  isReserved: boolean;
  reservedUntil: Date | string;
}

interface Position {
  station?: string;
  room?: string;
  floor?: string;
  location?: string;
}
