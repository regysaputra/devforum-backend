import Joi from 'joi';

const VerifyCodeDTO = Joi.object({
  code: Joi
    .string()
    .trim()
    .required()
    .messages({
      'string.base': 'code must be a string.',
      'string.empty': 'code cannot be empty.',
      'any.required': 'code is a required field.'
    }),

  identifier: Joi
    .string()
    .trim()
    .required()
    .messages({
      'string.base': 'identifier must be a string.',
      'string.empty': 'identifier cannot be empty.',
      'any.required': 'identifier is a required field.'
    }),
});

export default VerifyCodeDTO;