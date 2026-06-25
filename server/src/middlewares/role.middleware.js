import ApiError from '../utils/ApiError.js';

/**
 * Middleware to authorize specific user roles.
 * @param {...string} roles - List of allowed roles.
 * @returns {Function} Express middleware.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(500, 'Authentication middleware not applied before authorization'));
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const allowedRoles = roles.map((r) => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ApiError(
          403,
          `User role '${req.user.role}' is not authorized to access this route`
        )
      );
    }

    next();
  };
};
