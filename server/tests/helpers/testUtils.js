import jwt from 'jsonwebtoken';
import User from '../../src/models/user.model.js';
import Account from '../../src/models/account.model.js';

/**
 * Generates an Authorization header with a Bearer JWT token for a user ID.
 * @param {string|ObjectId} userId - The user's ID.
 * @returns {Object} HTTP headers object with Authorization property.
 */
export const getAuthHeader = (userId) => {
  const token = jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
  return { Authorization: `Bearer ${token}` };
};

/**
 * Programmatically creates a test user in the database.
 * @param {Object} data - Optional overrides.
 * @returns {Promise<Object>} The created Mongoose user document and its object version.
 */
export const createTestUser = async (data = {}) => {
  const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const defaultUser = {
    name: 'Test User',
    email: `testuser_${uniqueSuffix}@example.com`,
    password: 'Password123!',
    role: 'customer',
    isBlocked: false
  };

  const merged = { ...defaultUser, ...data };
  const user = await User.create(merged);
  
  const userObj = user.toObject();
  delete userObj.password;
  
  return { user, userObj };
};

/**
 * Programmatically creates a test account in the database.
 * @param {string|ObjectId} ownerId - Owner's user ID.
 * @param {Object} data - Optional overrides.
 * @returns {Promise<Object>} The created Mongoose account document.
 */
export const createTestAccount = async (ownerId, data = {}) => {
  const uniqueNum = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const defaultAccount = {
    owner: ownerId,
    accountNumber: uniqueNum,
    accountType: 'savings',
    balance: 0,
    status: 'active'
  };

  return await Account.create({ ...defaultAccount, ...data });
};
