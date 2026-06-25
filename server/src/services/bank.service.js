import mongoose from 'mongoose';
import Account from '../models/account.model.js';
import Transaction from '../models/transaction.model.js';
import ApiError from '../utils/ApiError.js';
import { generateAccountNumber } from '../utils/helpers.js';

/**
 * Opens a new account for a user with a unique account number.
 * @param {string} userId 
 * @param {string} accountType 
 */
export const openAccount = async (userId, accountType) => {
  let accountNumber;
  let isUnique = false;

  // Ensure unique account number in system
  while (!isUnique) {
    accountNumber = generateAccountNumber();
    const existing = await Account.findOne({ accountNumber });
    if (!existing) {
      isUnique = true;
    }
  }

  return await Account.create({
    owner: userId,
    accountNumber,
    accountType,
    balance: 0
  });
};

/**
 * Deposits cash into an account.
 */
export const deposit = async ({ accountId, amount, reference }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findById(accountId).session(session);
    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    const balanceBefore = account.balance;
    account.balance += amount;
    const balanceAfter = account.balance;
    await account.save({ session });

    const transaction = await Transaction.create(
      [
        {
          account: accountId,
          transactionType: 'deposit',
          amount,
          balanceBefore,
          balanceAfter,
          reference,
          status: 'completed',
          createdBy: account.owner
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Withdraws cash from an account.
 */
export const withdraw = async ({ accountId, amount, reference }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const account = await Account.findById(accountId).session(session);
    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    if (account.balance < amount) {
      throw new ApiError(400, 'Insufficient balance');
    }

    const balanceBefore = account.balance;
    account.balance -= amount;
    const balanceAfter = account.balance;
    await account.save({ session });

    const transaction = await Transaction.create(
      [
        {
          account: accountId,
          transactionType: 'withdraw',
          amount,
          balanceBefore,
          balanceAfter,
          reference,
          status: 'completed',
          createdBy: account.owner
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * Transfers funds between accounts within an ACID transaction session.
 */
export const transfer = async ({
  senderAccountId,
  receiverAccountNumber,
  amount,
  reference
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await Account.findById(senderAccountId).session(session);
    if (!sender) {
      throw new ApiError(404, 'Sender account not found');
    }

    if (sender.balance < amount) {
      throw new ApiError(400, 'Insufficient balance for transfer');
    }

    const receiver = await Account.findOne({
      accountNumber: receiverAccountNumber
    }).session(session);

    if (!receiver) {
      throw new ApiError(404, 'Receiver account not found');
    }

    if (receiver.status !== 'active') {
      throw new ApiError(400, 'Recipient account is suspended or closed');
    }

    if (sender.accountNumber === receiver.accountNumber) {
      throw new ApiError(400, 'Cannot transfer to the same account');
    }

    // Adjust balances
    const balanceBefore = sender.balance;
    sender.balance -= amount;
    const balanceAfter = sender.balance;

    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    const transaction = await Transaction.create(
      [
        {
          senderAccount: sender._id,
          receiverAccount: receiver._id,
          transactionType: 'transfer',
          amount,
          balanceBefore,
          balanceAfter,
          reference,
          status: 'completed',
          createdBy: sender.owner
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
