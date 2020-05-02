import { NextFunction, Request, Response } from 'express';
import * as Joi from '@hapi/joi';
import { hospitalSchema } from '../../validation/Hospital';
import { HospitalService } from '../../services/HospitalService';
import { Hospital } from '../../interfaces/models/Hospital';
import { respond } from '../response';
import { LocationCriteria } from '../../interfaces/http/criteria/LocationCriteria';
import { PaginationCriteria } from '../../interfaces/http/criteria/PaginationCriteria';
import { PostalCodeCityCriteria } from '../../interfaces/http/criteria/PostalCodeCityCriteria';
import { Pagination } from '../../interfaces/Pagination';
import { ValidationError } from '../../error/ValidationError';

class HospitalController {
  protected service: HospitalService;

  constructor() {
    this.service = new HospitalService();
    this.index = this.index.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.show = this.show.bind(this);
    this.delete = this.delete.bind(this);
  }

  index(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Hospital> | void> | void {
    const limit: number = req.query.limit
      ? Number(req.query.limit as string)
      : 10;

    let criteria:
      | LocationCriteria
      | PaginationCriteria
      | PostalCodeCityCriteria
      | null = null;

    if (req.query.page) {
      criteria = new PaginationCriteria(Number(req.query.page as string));
    } else if (req.query.lat && req.query.lng) {
      criteria = new LocationCriteria(
        Number(req.query.lat as string),
        Number(req.query.lng as string),
        req.query.distance ? Number(req.query.distance as string) : 30,
        limit
      );
    } else if (req.query.postalCode && req.query.city) {
      criteria = new PostalCodeCityCriteria(
        req.query.city as string,
        req.query.postalCode as string,
        limit
      );
    }

    return this.service
      .index(criteria)
      .then((result: Hospital[] | Pagination<Hospital>) => {
        return respond(res, result as Pagination<Hospital> & Hospital[]);
      })
      .catch((err: Error) => next(err));
  }

  create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Hospital> | void> | void {
    const validation: Joi.ValidationResult = hospitalSchema.validate(req.body, {
      stripUnknown: true,
    });

    if (validation.error) {
      return next(new ValidationError(validation.error));
    }

    return this.service
      .create(validation.value)
      .then((result: Hospital) => {
        return respond(res, result);
      })
      .catch((err: Error) => next(err));
  }

  show(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Hospital> | void> {
    return this.service
      .show(req.params.id)
      .then((result: Hospital) => {
        return respond(res, result);
      })
      .catch((err: Error) => next(err));
  }

  delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<void> | void> {
    return this.service
      .delete(req.params.id)
      .then(() => {
        return respond(res);
      })
      .catch((err: Error) => next(err));
  }

  update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Hospital> | void> | void {
    const validation: Joi.ValidationResult = hospitalSchema.validate(req.body, {
      stripUnknown: true,
    });

    if (validation.error) {
      return next(new ValidationError(validation.error));
    }

    return this.service
      .update(req.params.id, validation.value)
      .then((result: Hospital) => {
        return respond(res, result);
      })
      .catch((err: Error) => next(err));
  }
}

export const hc: HospitalController = new HospitalController();
