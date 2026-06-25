import ApiError from '../utils/ApiError.js';

/**
 * Express middleware helper to validate requests against Joi schemas.
 * @param {Object} schema - Joi validation schema object
 * @param {string} source - Request source to validate ('body', 'query', 'params')
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { value, error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(', ');
      return next(new ApiError(400, errorMessage));
    }

    // Assign sanitized properties back to req[source]
    req[source] = value;
    next();
  };
};
