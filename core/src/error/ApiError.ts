export class ApiError extends Error {
  protected status: number;

  protected errorCode: number;

  protected meta: object | null = null;

  constructor(
    message: string,
    status: number,
    errorCode = -1,
    meta: object | null = null
  ) {
    super();

    this.name = this.constructor.name;
    this.errorCode = errorCode;

    this.message = message || 'Something went wrong. Please try again.';

    this.status = status || 500;
    this.meta = meta;
  }

  getMessage(): string {
    return this.message;
  }

  getStatus(): number {
    return this.status;
  }

  getCode(): number {
    return this.errorCode;
  }

  getMeta(): object | null {
    return this.meta;
  }

  getName(): string {
    return this.name;
  }
}
