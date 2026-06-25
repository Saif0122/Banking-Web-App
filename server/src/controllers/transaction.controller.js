import * as transactionService from '../services/transaction.service.js';
import * as auditService from '../services/audit.service.js';
import Account from '../models/account.model.js';
import ApiError from '../utils/ApiError.js';
import { sendResponse } from '../utils/response.js';

/**
 * @desc    Deposit funds to an account
 * @route   POST /api/v1/transactions/deposit
 * @access  Private
 */
export const depositFunds = async (req, res, next) => {
  try {
    const { accountId, amount, description, reference, metadata } = req.body;

    const account = await Account.findById(accountId);
    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    // Security: Only owner or admin can deposit
    const isOwner = account.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role && req.user.role.toLowerCase() === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ApiError(403, 'Not authorized to perform a deposit on this account');
    }

    const updatedAccount = await transactionService.deposit({
      accountId,
      amount,
      userId: req.user._id,
      description,
      reference,
      metadata
    });

    // Log audit event DEPOSIT
    await auditService.logAction({
      action: 'DEPOSIT',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { accountId, amount, newBalance: updatedAccount.balance, accountNumber: account.accountNumber }
    });

    sendResponse(res, 200, 'Deposit successful', { account: updatedAccount });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Withdraw funds from an account
 * @route   POST /api/v1/transactions/withdraw
 * @access  Private
 */
export const withdrawFunds = async (req, res, next) => {
  try {
    const { accountId, amount, description, reference, metadata } = req.body;

    const account = await Account.findById(accountId);
    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    // Security: Only owner or admin can withdraw
    const isOwner = account.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role && req.user.role.toLowerCase() === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ApiError(403, 'Not authorized to perform a withdrawal from this account');
    }

    const updatedAccount = await transactionService.withdraw({
      accountId,
      amount,
      userId: req.user._id,
      description,
      reference,
      metadata
    });

    // Log audit event WITHDRAW
    await auditService.logAction({
      action: 'WITHDRAW',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { accountId, amount, newBalance: updatedAccount.balance, accountNumber: account.accountNumber }
    });

    sendResponse(res, 200, 'Withdrawal successful', { account: updatedAccount });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Transfer funds between accounts
 * @route   POST /api/v1/transactions/transfer
 * @access  Private
 */
export const transferFunds = async (req, res, next) => {
  try {
    const { senderAccountId, receiverAccountId, amount, description, reference, metadata } = req.body;

    const senderAccount = await Account.findById(senderAccountId);
    if (!senderAccount) {
      throw new ApiError(404, 'Sender account not found');
    }

    const receiverAccount = await Account.findById(receiverAccountId);
    if (!receiverAccount) {
      throw new ApiError(404, 'Receiver account not found');
    }

    // Security: Only owner of sender account or admin can transfer funds from it
    const isOwner = senderAccount.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role && req.user.role.toLowerCase() === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ApiError(403, 'Not authorized to transfer funds from this account');
    }

    await transactionService.transfer({
      senderAccountId,
      receiverAccountId,
      amount,
      userId: req.user._id,
      description,
      reference,
      metadata
    });

    // Log audit event TRANSFER
    await auditService.logAction({
      action: 'TRANSFER',
      user: req.user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {
        senderAccountId,
        senderAccountNumber: senderAccount.accountNumber,
        receiverAccountId,
        receiverAccountNumber: receiverAccount.accountNumber,
        amount
      }
    });

    sendResponse(res, 200, 'Transfer successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get account transactions
 * @route   GET /api/v1/transactions/account/:accountId
 * @access  Private
 */
export const getAccountTransactions = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findById(accountId);
    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    // Security: Only owner or admin can view history
    const isOwner = account.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role && req.user.role.toLowerCase() === 'admin';
    if (!isOwner && !isAdmin) {
      throw new ApiError(403, 'Not authorized to view transaction history for this account');
    }

    const transactions = await transactionService.getAccountTransactions(accountId);

    sendResponse(res, 200, 'Transactions retrieved successfully', { transactions });
  } catch (error) {
    next(error);
  }
};
