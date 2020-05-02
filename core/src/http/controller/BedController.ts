import { BedService } from '../../services/BedService';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../error/ValidationError';
import { respond } from '../response';
import { createBedSchema, updateBedSchema } from '../../validation/Bed';
import * as Joi from '@hapi/joi';
import { Bed } from '../../interfaces/models/Bed';

class BedController {
  protected service: BedService;

  constructor() {
    this.service = new BedService();
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.show = this.show.bind(this);
    this.block = this.block.bind(this);
    this.unblock = this.unblock.bind(this);
    this.delete = this.delete.bind(this);
  }

  create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Bed> | void> | void {
    const validation: Joi.ValidationResult = createBedSchema.validate(
      req.body,
      {
        stripUnknown: true,
      }
    );

    if (validation.error) {
      return next(new ValidationError(validation.error));
    }

    return this.service
      .create(validation.value)
      .then((result: Bed) => {
        return respond(res, result);
      })
      .catch((err: Error) => next(err));
  }

  show(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Bed> | void> {
    return this.service
      .show(req.params.id)
      .then((result: Bed) => {
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
  ): Promise<Response<Bed> | void> | void {
    const validation: Joi.ValidationResult = updateBedSchema.validate(
      req.body,
      {
        stripUnknown: true,
      }
    );

    if (validation.error) {
      return next(new ValidationError(validation.error));
    }

    return this.service
      .update(req.params.id, validation.value)
      .then((result: Bed) => {
        return respond(res, result);
      })
      .catch((err: Error) => next(err));
  }

  block(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Bed> | void> | void {
    return this.service
      .block(req.params.id)
      .then((result: Bed) => {
        return respond(res, result);
      })
      .catch((err: Error) => next(err));
  }

  unblock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<Bed> | void> | void {
    return this.service
      .unblock(req.params.id)
      .then((result: Bed) => {
        return respond(res, result);
      })
      .catch((err: Error) => next(err));
  }
}

export const bc: BedController = new BedController();
