import crypto from 'crypto';
import * as authService from '../services/auth.service.js';
import * as auditService from '../services/audit.service.js';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import { sendResponse } from '../utils/response.js';

/**
 * Helper to set access and refresh token HTTP-Only cookies.
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/'
  };

  if (accessToken) {
    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
  }

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    const user = await authService.registerUser({ name, email, password, role, avatar });
    const accessToken = authService.generateAccessToken(user._id);
    const refreshToken = await authService.generateRefreshTokenForUser(user._id);

    setTokenCookies(res, accessToken, refreshToken);

    // Audit log REGISTER
    await auditService.logAction({
      action: 'REGISTER',
      user: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { email: user.email }
    });

    sendResponse(res, 201, 'Registration successful', {
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService.loginUser(email, password);
    const accessToken = authService.generateAccessToken(user._id);
    const refreshToken = await authService.generateRefreshTokenForUser(user._id);

    setTokenCookies(res, accessToken, refreshToken);

    // Audit log LOGIN
    await auditService.logAction({
      action: 'LOGIN',
      user: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { email: user.email }
    });

    sendResponse(res, 200, 'Login successful', {
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    sendResponse(res, 200, 'User profile retrieved successfully', { user: req.user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new ApiError(400, 'Refresh token is required');
    }

    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const user = await User.findOne({
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt: { $gt: Date.now() }
    });

    if (!user) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    if (user.isBlocked) {
      throw new ApiError(403, 'Your account has been blocked. Please contact support.');
    }

    // Generate new Access and Refresh tokens
    const accessToken = authService.generateAccessToken(user._id);
    const newRefreshToken = await authService.generateRefreshTokenForUser(user._id);

    setTokenCookies(res, accessToken, newRefreshToken);

    sendResponse(res, 200, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request password reset link
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, 'User not found with this email');
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store in DB with 15m expiration
    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;

    if (process.env.NODE_ENV === 'development') {
      return sendResponse(res, 200, 'Password reset link generated (development)', { resetUrl });
    }

    sendResponse(res, 200, 'If an account exists with that email, a password reset link has been sent');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using reset token
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      throw new ApiError(400, 'Token is invalid or has expired');
    }

    // Update password (hashed automatically via pre-save hook)
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log PASSWORD_CHANGED audit action
    await auditService.logAction({
      action: 'PASSWORD_CHANGED',
      user: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { email: user.email, source: 'reset-password' }
    });

    sendResponse(res, 200, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password while logged in
 * @route   POST /api/v1/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(401, 'Incorrect current password');
    }

    user.password = newPassword;
    await user.save();

    // Log PASSWORD_CHANGED audit action
    await auditService.logAction({
      action: 'PASSWORD_CHANGED',
      user: user._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { email: user.email, source: 'change-password' }
    });

    sendResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user & clear cookies
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/'
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1, refreshTokenExpiresAt: 1 }
      });

      await auditService.logAction({
        action: 'LOGOUT',
        user: req.user._id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { email: req.user.email }
      });
    }

    sendResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user from all devices (invalidates refresh token)
 * @route   POST /api/v1/auth/logout-all
 * @access  Private
 */
export const logoutAllDevices = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/'
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    if (req.user) {
      // Invalidate refresh token to force all other devices to logout
      await User.findByIdAndUpdate(req.user._id, {
        $unset: { refreshToken: 1, refreshTokenExpiresAt: 1 }
      });

      await auditService.logAction({
        action: 'LOGOUT_ALL_DEVICES',
        user: req.user._id,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { email: req.user.email }
      });
    }

    sendResponse(res, 200, 'Logged out of all devices successfully');
  } catch (error) {
    next(error);
  }
};
