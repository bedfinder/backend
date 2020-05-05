export class PostalCodeCityCriteria {
  constructor(
    readonly city: string,
    readonly postalCode: string,
    readonly limit?: number
  ) {}
}
