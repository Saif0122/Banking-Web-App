import express from 'express';
import {
  createAccount,
  getAccounts,
  getAccountById,
  freezeAccount,
  activateAccount
} from '../controllers/account.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateObjectId } from '../middlewares/objectId.middleware.js';
import { createAccountSchema } from '../validations/account.validation.js';

const router = express.Router();

// Apply authentication middleware to all account routes
router.use(protect);

// User-facing routes
router.post('/', validate(createAccountSchema), createAccount);
router.get('/', getAccounts);
router.get('/:id', validateObjectId('id'), getAccountById);

// Admin-only operations
router.patch('/:id/freeze', validateObjectId('id'), authorize('admin'), freezeAccount);
router.patch('/:id/activate', validateObjectId('id'), authorize('admin'), activateAccount);

export default router;
