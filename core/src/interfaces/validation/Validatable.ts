export interface Validatable<S> {
  validate(item: S | Partial<S>, ...args: object[] | string[] | number[]): void;
}
