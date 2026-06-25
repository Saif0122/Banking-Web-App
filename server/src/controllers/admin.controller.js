import * as adminService from '../services/admin.service.js';
import * as auditService from '../services/audit.service.js';
import AuditLog from '../models/auditLog.model.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc    Get all users list
 * @route   GET /api/v1/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    sendResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a specific user by ID
 * @route   GET /api/v1/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    sendResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Block a user
 * @route   PATCH /api/v1/admin/users/:id/block
 * @access  Private/Admin
 */
export const blockUser = async (req, res, next) => {
  try {
    const user = await adminService.blockUser(req.params.id);

    // Log audit event USER_BLOCKED
    await auditService.logAction({
      action: 'USER_BLOCKED',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { targetUserId: user._id, targetUserEmail: user.email }
    });

    sendResponse(res, 200, 'User blocked successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unblock a user
 * @route   PATCH /api/v1/admin/users/:id/unblock
 * @access  Private/Admin
 */
export const unblockUser = async (req, res, next) => {
  try {
    const user = await adminService.unblockUser(req.params.id);

    // Log audit event USER_UNBLOCKED
    await auditService.logAction({
      action: 'USER_UNBLOCKED',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { targetUserId: user._id, targetUserEmail: user.email }
    });

    sendResponse(res, 200, 'User unblocked successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await adminService.deleteUser(req.params.id);
    sendResponse(res, 200, 'User deleted successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all accounts in the system
 * @route   GET /api/v1/admin/accounts
 * @access  Private/Admin
 */
export const getAllAccounts = async (req, res, next) => {
  try {
    const accounts = await adminService.getAllAccounts();
    sendResponse(res, 200, 'Accounts retrieved successfully', accounts);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Freeze a bank account
 * @route   PATCH /api/v1/admin/accounts/:id/freeze
 * @access  Private/Admin
 */
export const freezeAccount = async (req, res, next) => {
  try {
    const account = await adminService.freezeAccount(req.params.id);

    // Log audit event ACCOUNT_FROZEN
    await auditService.logAction({
      action: 'ACCOUNT_FROZEN',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { accountId: account._id, accountNumber: account.accountNumber }
    });

    sendResponse(res, 200, 'Account frozen successfully', account);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Activate a bank account
 * @route   PATCH /api/v1/admin/accounts/:id/activate
 * @access  Private/Admin
 */
export const activateAccount = async (req, res, next) => {
  try {
    const account = await adminService.activateAccount(req.params.id);
    sendResponse(res, 200, 'Account activated successfully', account);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Close a bank account
 * @route   PATCH /api/v1/admin/accounts/:id/close
 * @access  Private/Admin
 */
export const closeAccount = async (req, res, next) => {
  try {
    const account = await adminService.closeAccount(req.params.id);

    // Log audit event ACCOUNT_CLOSED
    await auditService.logAction({
      action: 'ACCOUNT_CLOSED',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { accountId: account._id, accountNumber: account.accountNumber }
    });

    sendResponse(res, 200, 'Account closed successfully', account);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all transactions in the system
 * @route   GET /api/v1/admin/transactions
 * @access  Private/Admin
 */
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await adminService.getAllTransactions();
    sendResponse(res, 200, 'Transactions retrieved successfully', transactions);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a specific transaction by ID
 * @route   GET /api/v1/admin/transactions/:id
 * @access  Private/Admin
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await adminService.getTransactionById(req.params.id);
    sendResponse(res, 200, 'Transaction retrieved successfully', transaction);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Search transactions with filters
 * @route   GET /api/v1/admin/transactions/search
 * @access  Private/Admin
 */
export const searchTransactions = async (req, res, next) => {
  try {
    const { type, status, accountNumber } = req.query;
    const transactions = await adminService.searchTransactions({ type, status, accountNumber });
    sendResponse(res, 200, 'Transactions found successfully', transactions);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get high-level system overview stats
 * @route   GET /api/v1/admin/overview
 * @access  Private/Admin
 */
export const getSystemOverview = async (req, res, next) => {
  try {
    const overview = await adminService.getSystemOverview();
    sendResponse(res, 200, 'System overview retrieved successfully', overview);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get system audit logs with pagination
 * @route   GET /api/v1/admin/audit-logs
 * @access  Private/Admin
 */
export const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalLogs = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalLogs / limit);

    sendResponse(res, 200, 'Audit logs retrieved successfully', {
      count: logs.length,
      pagination: {
        page,
        limit,
        totalPages,
        totalLogs
      },
      logs
    });
  } catch (error) {
    next(error);
  }
};
