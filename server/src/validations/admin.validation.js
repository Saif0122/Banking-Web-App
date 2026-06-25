import Joi from 'joi';

export const searchTransactionsSchema = Joi.object({
  type: Joi.string().valid('deposit', 'withdraw', 'transfer').optional().messages({
    'any.only': 'Transaction type must be one of [deposit, withdraw, transfer]'
  }),
  status: Joi.string().valid('completed', 'failed', 'pending').optional().messages({
    'any.only': 'Status must be one of [completed, failed, pending]'
  }),
  accountNumber: Joi.string().trim().optional()
});

export const getAuditLogsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    'number.min': 'Page must be greater than or equal to 1'
  }),
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    'number.min': 'Limit must be greater than or equal to 1',
    'number.max': 'Limit cannot exceed 100'
  })
});
