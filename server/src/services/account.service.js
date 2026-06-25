import Account from '../models/account.model.js';
import { generateUniqueAccountNumber } from '../utils/accountNumberGenerator.js';
import ApiError from '../utils/ApiError.js';
import { deposit } from './transaction.service.js';

/**
 * Creates a new banking account.
 * @param {string} userId - ID of the user owning the account
 * @param {Object} data - Account details containing accountType
 * @returns {Promise<Object>} The created account document
 */
export const createAccount = async (userId, data) => {
  const { name, accountType, initialDeposit = 0 } = data;

  if (!accountType || !['savings', 'checking', 'credit'].includes(accountType)) {
    throw new ApiError(400, 'Invalid or missing accountType. Must be savings, checking, or credit.');
  }

  const accountNumber = await generateUniqueAccountNumber();

  let account = await Account.create({
    owner: userId,
    name,
    accountNumber,
    accountType,
    balance: 0,
    status: 'active'
  });

  if (initialDeposit > 0) {
    account = await deposit({
      accountId: account._id,
      amount: initialDeposit,
      userId,
      description: 'Initial deposit'
    });
  }

  return account;
};

/**
 * Retrieves all accounts owned by a specific user.
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of accounts
 */
export const getUserAccounts = async (userId) => {
  return await Account.find({ owner: userId });
};

/**
 * Retrieves a single account by ID, verifying user ownership.
 * @param {string} accountId - Account ID
 * @param {string} userId - Current user ID (for verification)
 * @returns {Promise<Object>} The account document
 */
export const getAccountById = async (accountId, userId) => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new ApiError(404, 'Bank account not found');
  }

  if (account.owner.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to view this account');
  }

  return account;
};

/**
 * Retrieves all accounts in the system (for Admin view).
 * @returns {Promise<Array>} List of all accounts
 */
export const getAllAccounts = async () => {
  return await Account.find({}).populate('owner', 'name email');
};

/**
 * Freezes a bank account, setting its status to 'frozen'.
 * @param {string} accountId - Account ID
 * @returns {Promise<Object>} The updated account document
 */
export const freezeAccount = async (accountId) => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new ApiError(404, 'Bank account not found');
  }

  account.status = 'frozen';
  await account.save();
  return account;
};

/**
 * Activates a bank account, setting its status to 'active'.
 * @param {string} accountId - Account ID
 * @returns {Promise<Object>} The updated account document
 */
export const activateAccount = async (accountId) => {
  const account = await Account.findById(accountId);
  if (!account) {
    throw new ApiError(404, 'Bank account not found');
  }

  account.status = 'active';
  await account.save();
  return account;
};
