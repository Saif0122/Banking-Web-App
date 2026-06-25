import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to protect routes by validating JWT Bearer tokens
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Read token from Cookies or Authorization header
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // 2. Verify JWT Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find User in DB (excluding password)
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new ApiError(401, 'The user associated with this token no longer exists'));
      }

      // Check if the user is blocked
      if (user.isBlocked) {
        return next(new ApiError(403, 'Your account has been blocked. Please contact support.'));
      }

      // 4. Attach user to req.user context
      req.user = user;
      return next();
    } catch (error) {
      return next(new ApiError(401, 'Not authorized, token validation failed'));
    }
  }

  // 5. Reject request if token is missing
  if (!token) {
    return next(new ApiError(401, 'Not authorized, access token missing'));
  }
};
