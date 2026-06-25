/**
 * Standardizes API responses
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {any} [data=null] - Optional data payload
 */
export const sendResponse = (res, statusCode, message, data = null) => {
  const success = statusCode >= 200 && statusCode < 300;
  
  const response = {
    success,
    message
  };

  if (data !== null) {
    if (success) {
      response.data = data;
    } else {
      // The prompt specified { success, message, data } as the format for everything.
      // Or {success, message, errors} but we can just use data as the catch-all payload
      // wait, the prompt says "Every endpoint should return: {success, message, data} or {success, message, errors}".
      response.errors = data;
    }
  }

  return res.status(statusCode).json(response);
};
