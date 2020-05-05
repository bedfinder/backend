export interface ReservationRequest {
  hospital: string;
  station: string;
  isHighCare?: boolean;
  hasEcmo?: boolean;
  reservedUntil: string | Date;
}
