import * as accountService from '../services/account.service.js';
import * as auditService from '../services/audit.service.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc    Create/Open a new bank account
 * @route   POST /api/v1/accounts
 * @access  Private
 */
export const createAccount = async (req, res, next) => {
  try {
    const { name, accountType, initialDeposit } = req.body;
    
    const account = await accountService.createAccount(req.user._id, { name, accountType, initialDeposit });

    // Log audit event ACCOUNT_CREATED
    await auditService.logAction({
      action: 'ACCOUNT_CREATED',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { accountId: account._id, accountNumber: account.accountNumber, accountType: account.accountType }
    });

    sendResponse(res, 201, 'Account created successfully', { account });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get accounts list (User's own accounts, or all accounts for Admin/Auditor)
 * @route   GET /api/v1/accounts
 * @access  Private
 */
export const getAccounts = async (req, res, next) => {
  try {
    const role = req.user.role ? req.user.role.toLowerCase() : '';
    let accounts;

    if (role === 'admin' || role === 'auditor') {
      accounts = await accountService.getAllAccounts();
    } else {
      accounts = await accountService.getUserAccounts(req.user._id);
    }

    sendResponse(res, 200, 'Accounts retrieved successfully', {
      count: accounts.length,
      accounts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get account details by ID
 * @route   GET /api/v1/accounts/:id
 * @access  Private
 */
export const getAccountById = async (req, res, next) => {
  try {
    const account = await accountService.getAccountById(req.params.id, req.user._id);

    sendResponse(res, 200, 'Account retrieved successfully', { account });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Freeze an account (stop transactions)
 * @route   PATCH /api/v1/accounts/:id/freeze
 * @access  Private/Admin
 */
export const freezeAccount = async (req, res, next) => {
  try {
    const account = await accountService.freezeAccount(req.params.id);

    // Log audit event ACCOUNT_FROZEN
    await auditService.logAction({
      action: 'ACCOUNT_FROZEN',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { accountId: account._id, accountNumber: account.accountNumber }
    });

    sendResponse(res, 200, 'Account frozen successfully', { account });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Activate a frozen/closed account
 * @route   PATCH /api/v1/accounts/:id/activate
 * @access  Private/Admin
 */
export const activateAccount = async (req, res, next) => {
  try {
    const account = await accountService.activateAccount(req.params.id);

    sendResponse(res, 200, 'Account activated successfully', { account });
  } catch (error) {
    next(error);
  }
};
