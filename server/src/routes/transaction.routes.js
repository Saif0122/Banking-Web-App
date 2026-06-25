import express from 'express';
import {
  depositFunds,
  withdrawFunds,
  transferFunds,
  getAccountTransactions
} from '../controllers/transaction.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  depositSchema,
  withdrawSchema,
  transferSchema
} from '../validations/transaction.validation.js';
import { validateObjectId } from '../middlewares/objectId.middleware.js';

import { transactionLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

// Protected routes only
router.use(protect);
router.use(transactionLimiter);

router.post('/deposit', validate(depositSchema), depositFunds);
router.post('/withdraw', validate(withdrawSchema), withdrawFunds);
router.post('/transfer', validate(transferSchema), transferFunds);
router.get('/account/:accountId', validateObjectId('accountId'), getAccountTransactions);

export default router;
