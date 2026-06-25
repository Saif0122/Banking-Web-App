import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import Account from '../models/account.model.js';
import Transaction from '../models/transaction.model.js';
import { generateAccountNumber } from '../utils/helpers.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@bank.com',
    password: 'adminpassword123',
    role: 'admin'
  },
  {
    name: 'Auditor User',
    email: 'auditor@bank.com',
    password: 'auditorpassword123',
    role: 'auditor'
  },
  {
    name: 'John Doe',
    email: 'john@gmail.com',
    password: 'userpassword123',
    role: 'customer'
  },
  {
    name: 'Jane Smith',
    email: 'jane@gmail.com',
    password: 'userpassword123',
    role: 'customer'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Database connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Account.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Purged existing records.');

    // Create users
    const createdUsers = await User.create(users);
    console.log('Seeded users.');

    // Find our customer users to create accounts
    const john = createdUsers.find(u => u.email === 'john@gmail.com');
    const jane = createdUsers.find(u => u.email === 'jane@gmail.com');

    // Seed bank accounts
    const johnChecking = await Account.create({
      owner: john._id,
      accountNumber: generateAccountNumber(),
      accountType: 'current',
      balance: 5000,
      status: 'active'
    });

    const johnSavings = await Account.create({
      owner: john._id,
      accountNumber: generateAccountNumber(),
      accountType: 'savings',
      balance: 12500,
      status: 'active'
    });

    const janeChecking = await Account.create({
      owner: jane._id,
      accountNumber: generateAccountNumber(),
      accountType: 'current',
      balance: 3200,
      status: 'active'
    });

    console.log('Seeded bank accounts.');

    // Seed transaction log (matching new schema)
    await Transaction.create({
      senderAccount: johnChecking._id,
      receiverAccount: janeChecking._id,
      transactionType: 'transfer',
      amount: 450,
      balanceBefore: 5450,
      balanceAfter: 5000,
      description: 'Monthly Rent share',
      status: 'completed',
      createdBy: john._id
    });

    await Transaction.create({
      account: johnSavings._id,
      transactionType: 'deposit',
      amount: 1000,
      balanceBefore: 11500,
      balanceAfter: 12500,
      description: 'Cash deposit via ATM',
      status: 'completed',
      createdBy: john._id
    });

    console.log('Seeded transaction history.');
    console.log('Data Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedData();
