import ApiError from '../utils/ApiError.js';
import { sendResponse } from '../utils/response.js';

// Not Found Handler
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

// Global Error Handler
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === 'development') {
    if (err.isOperational && err.statusCode < 500) {
      console.log(`[Operational Error]: ${err.statusCode} - ${err.message}`);
    } else {
      console.error(err);
    }
  }

  // Mongoose bad ObjectId CastError
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(404, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ApiError(409, message);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new ApiError(422, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token signature, authorization denied';
    error = new ApiError(401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Authentication token expired';
    error = new ApiError(401, message);
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  sendResponse(res, statusCode, message, err.errors || null);
};
