import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Generates a signed Access JWT token for a given user ID, expiring in 15 minutes.
 * @param {string} userId - Database ID of the user.
 * @returns {string} Signed JWT.
 */
export const generateAccessToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new ApiError(500, 'JWT Secret is not configured in environment variables');
  }

  return jwt.sign({ id: userId }, secret, { expiresIn: '15m' });
};

/**
 * Generates a cryptographically secure random Refresh Token, hashes it with SHA-256,
 * stores the hashed version and its 7-day expiration time on the user document,
 * and returns the raw (unhashed) token.
 * @param {string} userId - Database ID of the user.
 * @returns {Promise<string>} The raw refresh token.
 */
export const generateRefreshTokenForUser = async (userId) => {
  const rawToken = crypto.randomBytes(40).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await User.findByIdAndUpdate(userId, {
    refreshToken: hashedToken,
    refreshTokenExpiresAt: expiresAt
  });

  return rawToken;
};

/**
 * Registers a new user.
 * @param {Object} userData - Registration fields including name, email, password, role, and avatar.
 * @returns {Promise<Object>} The registered user object (without password).
 */
export const registerUser = async (userData) => {
  const { name, email, password, role, avatar } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email address already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

/**
 * Authenticates user credentials.
 * @param {string} email - Email address.
 * @param {string} password - Password.
 * @returns {Promise<Object>} The authenticated user object (without password).
 */
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.isBlocked) {
    throw new ApiError(403, 'Your account has been blocked. Please contact support.');
  }

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};
