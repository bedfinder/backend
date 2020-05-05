import * as Joi from '@hapi/joi';

interface BaseValidation {
  [k: string]: Joi.AnySchema;
}

const base: BaseValidation = {
  hasEcmo: Joi.bool().allow(null),
  isAvailable: Joi.bool().allow(null),
  isHighCare: Joi.bool().allow(null),
  isReserved: Joi.bool().allow(null),
  reservedUntil: Joi.date()
    .greater('now')
    .allow(null),
};

export const createBedSchema: Joi.ObjectSchema = Joi.object().keys({
  ...base,
  position: Joi.object().keys({
    floor: Joi.string().allow(null, ''),
    location: Joi.string().allow(null, ''),
    room: Joi.string().allow(null, ''),
    station: Joi.string().required(),
  }),
  hospital: Joi.string().required(),
});

export const updateBedSchema: Joi.ObjectSchema = Joi.object().keys({
  ...base,
  position: Joi.object().keys({
    floor: Joi.string().allow(null, ''),
    location: Joi.string().allow(null, ''),
    room: Joi.string().allow(null, ''),
    station: Joi.string().allow(null),
  }),
});
