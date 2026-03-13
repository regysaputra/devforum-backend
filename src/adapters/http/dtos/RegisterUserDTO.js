import Joi from 'joi';

const VerifyCodeDTO = Joi.object({
  name: Joi
    .string()
    .trim()
    .required()
    .messages({
      'string.base': 'name must be a string.',
      'string.empty': 'name cannot be empty.',
      'any.required': 'name is a required field.'
    }),

  password: Joi
    .string()
    .trim()
    .min(8)
    .required()
    .messages({
      'string.base': 'password must be a string',
      'string.empty': 'password cannot be empty',
      'string.min': 'password must be at least 8 characters long',
      'any.required': 'password is a required field'
    })
});

export default VerifyCodeDTO;