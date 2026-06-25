import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware to validate if route parameter is a valid MongoDB ObjectId.
 * @param {string} paramName - Name of the parameter to validate (e.g. 'id' or 'accountId')
 */
export const validateObjectId = (paramName = 'id') => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return next(new ApiError(400, `Invalid ID format for parameter '${paramName}'`));
  }
  next();
};
