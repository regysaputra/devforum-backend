import Joi from 'joi';

const SendVerificationCodeDTO = Joi.object({
  identifier: Joi
    .string()
    .trim()
    .required()
    .messages({
      'string.base': 'Identifier must be a string.',
      'string.empty': 'Identifier cannot be empty.',
      'any.required': 'Identifier is a required field.'
    }),

  channel: Joi.string()
    .trim()
    .lowercase() // Automatically converts 'SMS' or 'Email' to lowercase
    .valid('sms', 'email')
    .required()
    .messages({
      'string.base': 'Channel must be a string.',
      'any.only': 'Channel must be either "sms" or "email".',
      'any.required': 'Channel is a required field.'
    })
});

export default SendVerificationCodeDTO;