import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validateObjectId } from '../middlewares/objectId.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { searchTransactionsSchema, getAuditLogsSchema } from '../validations/admin.validation.js';
import {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  deleteUser,
  getAllAccounts,
  freezeAccount,
  activateAccount,
  closeAccount,
  getAllTransactions,
  getTransactionById,
  searchTransactions,
  getSystemOverview,
  getAuditLogs
} from '../controllers/admin.controller.js';

import { adminLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

// Apply authentication and admin authorization globally to all routes
router.use(protect);
router.use(authorize('admin'));
router.use(adminLimiter);

// 1. User Management Endpoints
router.get('/users', getAllUsers);
router.get('/users/:id', validateObjectId('id'), getUserById);
router.patch('/users/:id/block', validateObjectId('id'), blockUser);
router.patch('/users/:id/unblock', validateObjectId('id'), unblockUser);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

// 2. Account Management Endpoints
router.get('/accounts', getAllAccounts);
router.patch('/accounts/:id/freeze', validateObjectId('id'), freezeAccount);
router.patch('/accounts/:id/activate', validateObjectId('id'), activateAccount);
router.patch('/accounts/:id/close', validateObjectId('id'), closeAccount);

// 3. Transaction Monitoring Endpoints
router.get('/transactions', getAllTransactions);
router.get('/transactions/search', validate(searchTransactionsSchema, 'query'), searchTransactions);
router.get('/transactions/:id', validateObjectId('id'), getTransactionById);

// 4. System Overview Endpoint
router.get('/overview', getSystemOverview);

// 5. System Audit Log Endpoint
router.get('/audit-logs', validate(getAuditLogsSchema, 'query'), getAuditLogs);

export default router;
