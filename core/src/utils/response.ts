import { Response } from 'express';
import { getStatusText } from 'http-status-codes';

interface Return {
  data: unknown | unknown[];
  status?: string;
  meta?: {
    count?: number;
  };
}

export const respond = (
  res: Response,
  payload: unknown | unknown[],
  code: number,
  requestDoneCallback?: Function,
  meta?: Return['meta']
) => {
  const returnObject: Return = {
    data: payload,
  };

  if (meta) {
    returnObject.meta = meta;
  }

  res.status(code).json({ ...returnObject, status: getStatusText(code) });
  if (requestDoneCallback) {
    res.on('finish', requestDoneCallback(returnObject));
  }
};
