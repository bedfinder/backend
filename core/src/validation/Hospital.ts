import * as Joi from '@hapi/joi';

export const hospitalSchema: Joi.ObjectSchema = Joi.object().keys({
  address: Joi.object().keys({
    city: Joi.string().required(),
    country: Joi.string().allow(null, ''),
    street: Joi.string().required(),
    postalCode: Joi.string().required(),
    state: Joi.string().allow(null, ''),
    location: Joi.object().keys({
      type: Joi.string()
        .valid('Point')
        .required(),
      coordinates: Joi.array()
        .items(Joi.number())
        .min(2)
        .max(2),
    }),
  }),
  contact: Joi.object().keys({
    phoneNumbers: Joi.array()
      .items(Joi.string())
      .default([]),
    web: Joi.string()
      .allow(null)
      .default(''),
  }),
  description: Joi.string().allow(null, ''),
  name: Joi.string().required(),
});
