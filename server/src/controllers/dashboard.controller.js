import * as dashboardService from '../services/dashboard.service.js';
import ApiError from '../utils/ApiError.js';
import { sendResponse } from '../utils/response.js';

/**
 * Resolves the query scope ('all' vs 'user') and verifies authorization.
 * @param {Object} req - Express request object
 * @returns {string} The resolved scope ('all' or 'user')
 * @throws {ApiError} If non-admin attempts to access global scope
 */
const getScope = (req) => {
  const scope = req.query.scope;
  const isAdmin = req.user.role && req.user.role.toLowerCase() === 'admin';

  if (scope === 'all') {
    if (!isAdmin) {
      throw new ApiError(403, 'Access denied. Only administrators can view all data.');
    }
    return 'all';
  }
  return 'user';
};

/**
 * @desc    Get dashboard summary statistics
 * @route   GET /api/v1/dashboard/summary
 * @access  Private
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const scope = getScope(req);
    const summary = await dashboardService.getDashboardSummary(req.user._id, scope);

    // Provide both "summary" and "data" keys for compatibility
    sendResponse(res, 200, 'Dashboard summary retrieved successfully', {
      summary,
      ...summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recent 10 transactions
 * @route   GET /api/v1/dashboard/recent-transactions
 * @access  Private
 */
export const getRecentTransactions = async (req, res, next) => {
  try {
    const scope = getScope(req);
    const transactions = await dashboardService.getRecentTransactions(req.user._id, scope);

    sendResponse(res, 200, 'Recent transactions retrieved successfully', transactions);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get monthly transaction analytics for current month
 * @route   GET /api/v1/dashboard/monthly-analytics
 * @access  Private
 */
export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const scope = getScope(req);
    const analytics = await dashboardService.getMonthlyAnalytics(req.user._id, scope);

    sendResponse(res, 200, 'Monthly analytics retrieved successfully', analytics);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get account statistics (counts by type and status)
 * @route   GET /api/v1/dashboard/account-stats
 * @access  Private
 */
export const getAccountStatistics = async (req, res, next) => {
  try {
    const scope = getScope(req);
    const stats = await dashboardService.getAccountStatistics(req.user._id, scope);

    sendResponse(res, 200, 'Account statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};
