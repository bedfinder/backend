export interface BaseResponse<T> {
  data: T | T[] | null;
  total?: number;
  status?: string;
}
