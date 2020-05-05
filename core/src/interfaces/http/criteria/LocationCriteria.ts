export class LocationCriteria {
  constructor(
    readonly lat: number,
    readonly lng: number,
    readonly distance: number = 30,
    readonly limit?: number
  ) {}
}
