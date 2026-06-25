import express from 'express';
import {
  register,
  login,
  getMe,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
  logoutAllDevices
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} from '../validations/auth.validation.js';
import { authLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, validate(registerSchema), register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Log in an existing user
 * @access  Public
 */
router.post('/login', authLimiter, validate(loginSchema), login);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Generate new access and refresh tokens
 * @access  Public
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset link
 * @access  Public
 */
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);

/**
 * @route   POST /api/v1/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password while logged in
 * @access  Private
 */
router.post('/change-password', protect, validate(changePasswordSchema), changePassword);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user & clear cookies
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Logout user from all devices
 * @access  Private
 */
router.post('/logout-all', protect, logoutAllDevices);

export default router;
