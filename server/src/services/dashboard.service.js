import mongoose from 'mongoose';
import Account from '../models/account.model.js';
import Transaction from '../models/transaction.model.js';

/**
 * Retrieves a high-level summary of the dashboard.
 * Uses MongoDB Aggregation for efficiency.
 * @param {string} userId - User ID
 * @param {string} scope - Query scope ('all' for admin-only global data, 'user' for individual)
 * @returns {Promise<Object>} Summary statistics
 */
export const getDashboardSummary = async (userId, scope = 'user') => {
  const accountFilter = scope === 'all' ? {} : { owner: new mongoose.Types.ObjectId(userId) };

  // 1. Aggregate account statistics
  const accountStats = await Account.aggregate([
    { $match: accountFilter },
    {
      $group: {
        _id: null,
        totalAccounts: { $sum: 1 },
        activeAccounts: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        totalBalance: { $sum: '$balance' },
        accountIds: { $push: '$_id' }
      }
    }
  ]);

  if (!accountStats || accountStats.length === 0) {
    return {
      totalAccounts: 0,
      activeAccounts: 0,
      totalBalance: 0,
      totalTransactions: 0
    };
  }

  const { totalAccounts, activeAccounts, totalBalance, accountIds } = accountStats[0];

  // 2. Aggregate transaction count
  const transactionFilter = scope === 'all'
    ? {}
    : {
        $or: [
          { account: { $in: accountIds } },
          { senderAccount: { $in: accountIds } },
          { receiverAccount: { $in: accountIds } }
        ]
      };

  const transactionStats = await Transaction.aggregate([
    { $match: transactionFilter },
    { $count: 'totalTransactions' }
  ]);

  const totalTransactions = transactionStats[0]?.totalTransactions || 0;

  return {
    totalAccounts,
    activeAccounts,
    totalBalance,
    totalTransactions
  };
};

/**
 * Retrieves the latest 10 transactions.
 * Sorts newest first and populates account and creator details.
 * @param {string} userId - User ID
 * @param {string} scope - Query scope
 * @returns {Promise<Array>} Transaction list
 */
export const getRecentTransactions = async (userId, scope = 'user') => {
  let transactionFilter = {};

  if (scope !== 'all') {
    const userAccounts = await Account.find({ owner: userId }).select('_id');
    const accountIds = userAccounts.map(acc => acc._id);

    transactionFilter = {
      $or: [
        { account: { $in: accountIds } },
        { senderAccount: { $in: accountIds } },
        { receiverAccount: { $in: accountIds } }
      ]
    };
  }

  const transactions = await Transaction.find(transactionFilter)
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('account', 'accountNumber accountType balance status')
    .populate('senderAccount', 'accountNumber accountType balance status')
    .populate('receiverAccount', 'accountNumber accountType balance status')
    .populate('createdBy', 'name email');

  return transactions;
};

/**
 * Computes transaction analytics for the current month.
 * Uses MongoDB Aggregation.
 * @param {string} userId - User ID
 * @param {string} scope - Query scope
 * @returns {Promise<Object>} Totals for deposits, withdrawals, and transfers
 */
export const getMonthlyAnalytics = async (userId, scope = 'user') => {
  const monthsData = [];
  const currentDate = new Date();
  
  // Generate the last 6 months labels
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    monthsData.push({
      month: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      monthNum: d.getMonth() + 1,
      deposits: 0,
      withdrawals: 0,
      transfers: 0
    });
  }

  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);

  const transactionMatch = {
    createdAt: { $gte: startDate },
    status: 'completed'
  };

  if (scope !== 'all') {
    const userAccounts = await Account.find({ owner: userId }).select('_id');
    const accountIds = userAccounts.map(acc => acc._id);

    transactionMatch.$or = [
      { account: { $in: accountIds } },
      { senderAccount: { $in: accountIds } },
      { receiverAccount: { $in: accountIds } }
    ];
  }

  const analytics = await Transaction.aggregate([
    { $match: transactionMatch },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          type: '$transactionType'
        },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  analytics.forEach(item => {
    const { year, month, type } = item._id;
    const match = monthsData.find(m => m.year === year && m.monthNum === month);
    if (match) {
      if (type === 'deposit') match.deposits = item.totalAmount;
      else if (type === 'withdraw') match.withdrawals = item.totalAmount;
      else if (type === 'transfer') match.transfers = item.totalAmount;
    }
  });

  return monthsData.map(({ month, deposits, withdrawals, transfers }) => ({
    month,
    deposits,
    withdrawals,
    transfers
  }));
};

/**
 * Computes account type and status statistics.
 * Uses MongoDB Aggregation.
 * @param {string} userId - User ID
 * @param {string} scope - Query scope
 * @returns {Promise<Object>} Counts of savings, current, frozen, and active accounts
 */
export const getAccountStatistics = async (userId, scope = 'user') => {
  const accountFilter = scope === 'all' ? {} : { owner: new mongoose.Types.ObjectId(userId) };

  const stats = await Account.aggregate([
    { $match: accountFilter },
    {
      $group: {
        _id: null,
        savingsAccounts: {
          $sum: { $cond: [{ $eq: ['$accountType', 'savings'] }, 1, 0] }
        },
        currentAccounts: {
          $sum: { $cond: [{ $eq: ['$accountType', 'current'] }, 1, 0] }
        },
        frozenAccounts: {
          $sum: { $cond: [{ $eq: ['$status', 'frozen'] }, 1, 0] }
        },
        activeAccounts: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        }
      }
    }
  ]);

  if (!stats || stats.length === 0) {
    return {
      savingsAccounts: 0,
      currentAccounts: 0,
      frozenAccounts: 0,
      activeAccounts: 0
    };
  }

  const result = stats[0];
  delete result._id;
  return result;
};
