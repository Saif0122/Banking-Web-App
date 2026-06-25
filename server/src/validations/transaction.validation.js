import Joi from 'joi';

export const depositSchema = Joi.object({
  accountId: Joi.string().required().messages({
    'any.required': 'Account ID is required',
    'string.empty': 'Account ID cannot be empty'
  }),
  amount: Joi.number().greater(0).required().messages({
    'number.greater': 'Deposit amount must be greater than zero',
    'any.required': 'Deposit amount is required'
  }),
  description: Joi.string().max(200).optional().allow(''),
  reference: Joi.string().optional().allow(''),
  metadata: Joi.object().optional().unknown(true)
});

export const withdrawSchema = Joi.object({
  accountId: Joi.string().required().messages({
    'any.required': 'Account ID is required',
    'string.empty': 'Account ID cannot be empty'
  }),
  amount: Joi.number().greater(0).required().messages({
    'number.greater': 'Withdrawal amount must be greater than zero',
    'any.required': 'Withdrawal amount is required'
  }),
  description: Joi.string().max(200).optional().allow(''),
  reference: Joi.string().optional().allow(''),
  metadata: Joi.object().optional().unknown(true)
});

export const transferSchema = Joi.object({
  senderAccountId: Joi.string().required().messages({
    'any.required': 'Sender account ID is required',
    'string.empty': 'Sender account ID cannot be empty'
  }),
  receiverAccountId: Joi.string().required().messages({
    'any.required': 'Receiver account ID is required',
    'string.empty': 'Receiver account ID cannot be empty'
  }),
  amount: Joi.number().greater(0).required().messages({
    'number.greater': 'Transfer amount must be greater than zero',
    'any.required': 'Transfer amount is required'
  }),
  description: Joi.string().max(200).optional().allow(''),
  reference: Joi.string().optional().allow(''),
  metadata: Joi.object().optional().unknown(true)
});
