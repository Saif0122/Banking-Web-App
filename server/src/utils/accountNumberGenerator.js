import Account from '../models/account.model.js';

/**
 * Generates a unique 10-digit account number.
 * Ensures the number is unique by querying the database.
 * @returns {Promise<string>} Unique 10-digit account number
 */
export const generateUniqueAccountNumber = async () => {
  let accountNumber;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 10-digit number between 1000000000 and 9999999999
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    
    // Check if it already exists in the database
    const existingAccount = await Account.findOne({ accountNumber });
    if (!existingAccount) {
      isUnique = true;
    }
  }

  return accountNumber;
};
