import Joi from 'joi';

/**
 * Validation schema for creating a bank account
 */
export const createAccountSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(100)
    .messages({
      'string.empty': 'Account name cannot be empty',
      'any.required': 'Account name is required'
    }),
  accountType: Joi.string()
    .valid('savings', 'checking', 'credit')
    .required()
    .messages({
      'string.empty': 'Account type cannot be empty',
      'any.only': 'Account type must be savings, checking, or credit',
      'any.required': 'Account type is required'
    }),
  initialDeposit: Joi.number()
    .min(0)
    .default(0)
    .messages({
      'number.min': 'Initial deposit cannot be negative',
      'number.base': 'Initial deposit must be a number'
    })
});
