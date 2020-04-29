import { Response } from 'express';
import { getStatusText } from 'http-status-codes';
import { BaseResponse } from '../interfaces/http/BaseResponse';
import { Pagination } from '../interfaces/Pagination';

export function respond<T>(
  res: Response,
  payload: T | T[] | (Pagination<T> & T) | null = null,
  code = 200,
  requestDoneCallback?: Function
): Response<T> {
  let response: BaseResponse<T> = {
    data: payload,
  };

  if (payload && 'data' in payload && 'total' in payload) {
    response = {
      data: payload.data,
      total: payload.total,
    };
  }

  if (requestDoneCallback) {
    res.on('finish', requestDoneCallback(response));
  }

  return res.status(code).json({ ...response, status: getStatusText(code) });
}
