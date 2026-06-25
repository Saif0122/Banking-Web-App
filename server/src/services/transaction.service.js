import mongoose from 'mongoose';
import Account from '../models/account.model.js';
import Transaction from '../models/transaction.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Helper to run operations in a transaction.
 * If the database is a standalone instance (common in local dev) that doesn't
 * support transactions, it falls back to executing the operations without a session.
 * @param {Function} operations - Async function receiving a session
 */
const runInTransaction = async (operations) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await operations(session);
    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch (abortError) {
      // Suppress secondary error on aborting failed/invalid transaction
    }
    session.endSession();

    // Check if error is due to MongoDB standalone (no replica set support)
    const isStandaloneError =
      error.message.includes('Transaction numbers are only allowed') ||
      error.message.includes('replica set member') ||
      error.codeName === 'InvalidOptions';

    if (isStandaloneError) {
      console.warn('MongoDB standalone detected. Running operations without a transaction session.');
      return await operations(null);
    }
    throw error;
  }
};

/**
 * Deposits funds into a banking account.
 * @param {Object} params
 * @param {string} params.accountId
 * @param {number} params.amount
 * @param {string} params.userId
 * @param {string} [params.description]
 * @returns {Promise<Object>} Updated account
 */
export const deposit = async ({ accountId, amount, userId, description, reference, metadata }) => {
  if (amount <= 0) {
    throw new ApiError(400, 'Deposit amount must be greater than zero');
  }

  return await runInTransaction(async (session) => {
    const account = await Account.findById(accountId).session(session);
    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    if (account.status !== 'active') {
      throw new ApiError(400, 'Account is not active');
    }

    const balanceBefore = account.balance;
    account.balance += amount;
    const balanceAfter = account.balance;

    await account.save({ session });

    await Transaction.create(
      [
        {
          account: accountId,
          transactionType: 'deposit',
          amount,
          balanceBefore,
          balanceAfter,
          description: description || 'Deposit funds',
          reference,
          metadata,
          status: 'completed',
          createdBy: userId
        }
      ],
      { session }
    );

    return account;
  });
};

/**
 * Withdraws funds from a banking account.
 * @param {Object} params
 * @param {string} params.accountId
 * @param {number} params.amount
 * @param {string} params.userId
 * @param {string} [params.description]
 * @returns {Promise<Object>} Updated account
 */
export const withdraw = async ({ accountId, amount, userId, description, reference, metadata }) => {
  if (amount <= 0) {
    throw new ApiError(400, 'Withdrawal amount must be greater than zero');
  }

  return await runInTransaction(async (session) => {
    const account = await Account.findById(accountId).session(session);
    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    if (account.status !== 'active') {
      throw new ApiError(400, 'Account is not active');
    }

    if (account.balance < amount) {
      throw new ApiError(400, 'Insufficient funds');
    }

    const balanceBefore = account.balance;
    account.balance -= amount;
    const balanceAfter = account.balance;

    await account.save({ session });

    await Transaction.create(
      [
        {
          account: accountId,
          transactionType: 'withdraw',
          amount,
          balanceBefore,
          balanceAfter,
          description: description || 'Withdrawal of funds',
          reference,
          metadata,
          status: 'completed',
          createdBy: userId
        }
      ],
      { session }
    );

    return account;
  });
};

/**
 * Transfers funds between accounts within a Mongoose transaction session.
 * @param {Object} params
 * @param {string} params.senderAccountId
 * @param {string} params.receiverAccountId
 * @param {number} params.amount
 * @param {string} params.userId
 * @param {string} [params.description]
 * @returns {Promise<void>}
 */
export const transfer = async ({
  senderAccountId,
  receiverAccountId,
  amount,
  userId,
  description,
  reference,
  metadata
}) => {
  if (amount <= 0) {
    throw new ApiError(400, 'Transfer amount must be greater than zero');
  }

  if (senderAccountId.toString() === receiverAccountId.toString()) {
    throw new ApiError(400, 'Sender and receiver accounts cannot be the same');
  }

  return await runInTransaction(async (session) => {
    const sender = await Account.findById(senderAccountId).session(session);
    if (!sender) {
      throw new ApiError(404, 'Sender account not found');
    }

    if (sender.status !== 'active') {
      throw new ApiError(400, 'Sender account is not active');
    }

    if (sender.balance < amount) {
      throw new ApiError(400, 'Insufficient balance for transfer');
    }

    const receiver = await Account.findById(receiverAccountId).session(session);
    if (!receiver) {
      throw new ApiError(404, 'Receiver account not found');
    }

    if (receiver.status !== 'active') {
      throw new ApiError(400, 'Receiver account is not active');
    }

    // Adjust balances
    const balanceBefore = sender.balance;
    sender.balance -= amount;
    const balanceAfter = sender.balance;

    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    await Transaction.create(
      [
        {
          senderAccount: senderAccountId,
          receiverAccount: receiverAccountId,
          transactionType: 'transfer',
          amount,
          balanceBefore,
          balanceAfter,
          description: description || 'Fund transfer',
          reference,
          metadata,
          status: 'completed',
          createdBy: userId
        }
      ],
      { session }
    );
  });
};

/**
 * Retrieves transactions for an account.
 * @param {string} accountId
 * @returns {Promise<Array>} Transaction history
 */
export const getAccountTransactions = async (accountId) => {
  return await Transaction.find({
    $or: [
      { account: accountId },
      { senderAccount: accountId },
      { receiverAccount: accountId }
    ]
  })
    .sort({ createdAt: -1 })
    .populate('account', 'accountNumber accountType')
    .populate('senderAccount', 'accountNumber accountType')
    .populate('receiverAccount', 'accountNumber accountType')
    .populate('createdBy', 'name email');
};
