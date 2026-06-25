import User from '../models/user.model.js';
import Account from '../models/account.model.js';
import Transaction from '../models/transaction.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Retrieves all users in the system.
 * @returns {Promise<Array>} List of users.
 */
export const getAllUsers = async () => {
  return await User.find({}).sort({ createdAt: -1 });
};

/**
 * Retrieves a single user by ID.
 * @param {string} id - User ID.
 * @returns {Promise<Object>} The user document.
 */
export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

/**
 * Blocks a user, preventing login and transactions.
 * @param {string} id - User ID.
 * @returns {Promise<Object>} The updated user document.
 */
export const blockUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  user.isBlocked = true;
  await user.save();
  return user;
};

/**
 * Unblocks a user.
 * @param {string} id - User ID.
 * @returns {Promise<Object>} The updated user document.
 */
export const unblockUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  user.isBlocked = false;
  await user.save();
  return user;
};

/**
 * Deletes a user from the database.
 * @param {string} id - User ID.
 * @returns {Promise<Object>} The deleted user document.
 */
export const deleteUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await User.findByIdAndDelete(id);
  return user;
};

/**
 * Retrieves all accounts in the system.
 * @returns {Promise<Array>} List of all accounts with owner details populated.
 */
export const getAllAccounts = async () => {
  return await Account.find({})
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Freezes a bank account.
 * @param {string} id - Account ID.
 * @returns {Promise<Object>} The updated account document.
 */
export const freezeAccount = async (id) => {
  const account = await Account.findById(id);
  if (!account) {
    throw new ApiError(404, 'Account not found');
  }
  account.status = 'frozen';
  await account.save();
  return account;
};

/**
 * Activates a frozen or closed bank account.
 * @param {string} id - Account ID.
 * @returns {Promise<Object>} The updated account document.
 */
export const activateAccount = async (id) => {
  const account = await Account.findById(id);
  if (!account) {
    throw new ApiError(404, 'Account not found');
  }
  account.status = 'active';
  await account.save();
  return account;
};

/**
 * Closes a bank account (cannot receive transactions).
 * @param {string} id - Account ID.
 * @returns {Promise<Object>} The updated account document.
 */
export const closeAccount = async (id) => {
  const account = await Account.findById(id);
  if (!account) {
    throw new ApiError(404, 'Account not found');
  }
  account.status = 'closed';
  await account.save();
  return account;
};

/**
 * Retrieves all transactions in the system.
 * @returns {Promise<Array>} List of transactions with detailed populations.
 */
export const getAllTransactions = async () => {
  return await Transaction.find({})
    .populate('account', 'accountNumber accountType')
    .populate('senderAccount', 'accountNumber accountType')
    .populate('receiverAccount', 'accountNumber accountType')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Retrieves a single transaction by ID.
 * @param {string} id - Transaction ID.
 * @returns {Promise<Object>} The transaction document.
 */
export const getTransactionById = async (id) => {
  const transaction = await Transaction.findById(id)
    .populate('account', 'accountNumber accountType')
    .populate('senderAccount', 'accountNumber accountType')
    .populate('receiverAccount', 'accountNumber accountType')
    .populate('createdBy', 'name email');
  if (!transaction) {
    throw new ApiError(404, 'Transaction not found');
  }
  return transaction;
};

/**
 * Searches and filters transactions.
 * @param {Object} queryParams - Filtering fields: type, status, accountNumber.
 * @returns {Promise<Array>} List of matching transactions.
 */
export const searchTransactions = async ({ type, status, accountNumber }) => {
  const query = {};
  
  if (type) {
    query.transactionType = type;
  }
  
  if (status) {
    query.status = status;
  }
  
  if (accountNumber) {
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return []; // No account means no transactions can match
    }
    query.$or = [
      { account: account._id },
      { senderAccount: account._id },
      { receiverAccount: account._id }
    ];
  }

  return await Transaction.find(query)
    .populate('account', 'accountNumber accountType')
    .populate('senderAccount', 'accountNumber accountType')
    .populate('receiverAccount', 'accountNumber accountType')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Aggregates and returns core system statistics.
 * @returns {Promise<Object>} System metrics overview.
 */
export const getSystemOverview = async () => {
  const userStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        blockedUsers: { $sum: { $cond: [{ $eq: ['$isBlocked', true] }, 1, 0] } }
      }
    }
  ]);

  const accountStats = await Account.aggregate([
    {
      $group: {
        _id: null,
        totalAccounts: { $sum: 1 },
        totalFunds: { $sum: '$balance' },
        activeAccounts: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        frozenAccounts: { $sum: { $cond: [{ $eq: ['$status', 'frozen'] }, 1, 0] } }
      }
    }
  ]);

  const transactionStats = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 }
      }
    }
  ]);

  return {
    users: userStats[0]?.totalUsers || 0,
    accounts: accountStats[0]?.totalAccounts || 0,
    transactions: transactionStats[0]?.totalTransactions || 0,
    totalFunds: accountStats[0]?.totalFunds || 0,
    activeAccounts: accountStats[0]?.activeAccounts || 0,
    frozenAccounts: accountStats[0]?.frozenAccounts || 0,
    blockedUsers: userStats[0]?.blockedUsers || 0
  };
};
