import Joi from 'joi';

const LoginDTO = Joi.object({
  email: Joi
    .string()
    .trim()
    .email()
    .required()
    .messages({
      'string.base': 'email must be a string.',
      'string.empty': 'name cannot be empty.',
      'string.email': 'email must be a valid email address.',
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
    }),

  rememberMe: Joi
    .bool()
    .required()
    .messages({
      'string.base': 'rememberMe must be a boolean.',
      'string.empty': 'rememberMe cannot be empty',
      'any.required': 'rememberMe is a required field',
    })
});

export default LoginDTO;