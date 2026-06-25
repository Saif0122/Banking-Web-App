/**
 * Generates a random 10-digit account number.
 * @returns {string}
 */
export const generateAccountNumber = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

/**
 * Checks if a string is a valid MongoDB ObjectId.
 * @param {string} id 
 * @returns {boolean}
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
