import express from 'express';
import {
  getDashboardSummary,
  getRecentTransactions,
  getMonthlyAnalytics,
  getAccountStatistics
} from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protect all routes within this module with JWT middleware
router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/recent-transactions', getRecentTransactions);
router.get('/monthly-analytics', getMonthlyAnalytics);
router.get('/account-stats', getAccountStatistics);

export default router;
