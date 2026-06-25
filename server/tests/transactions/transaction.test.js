import request from 'supertest';
import app from '../../src/app.js';
import Account from '../../src/models/account.model.js';
import Transaction from '../../src/models/transaction.model.js';
import { createTestUser, getAuthHeader, createTestAccount } from '../helpers/testUtils.js';

describe('Transaction Endpoints', () => {
  describe('POST /api/v1/transactions/deposit', () => {
    it('should deposit funds into an account successfully', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);
      const account = await createTestAccount(user._id, { balance: 100 });

      const res = await request(app)
        .post('/api/v1/transactions/deposit')
        .set(authHeader)
        .send({
          accountId: account._id.toString(),
          amount: 50,
          description: 'Test Deposit'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/successful/i);
      expect(res.body.account.balance).toBe(150);

      // Verify DB Account
      const dbAccount = await Account.findById(account._id);
      expect(dbAccount.balance).toBe(150);

      // Verify Transaction Record
      const tx = await Transaction.findOne({ account: account._id, transactionType: 'deposit' });
      expect(tx).toBeTruthy();
      expect(tx.amount).toBe(50);
      expect(tx.balanceBefore).toBe(100);
      expect(tx.balanceAfter).toBe(150);
    });
  });

  describe('POST /api/v1/transactions/withdraw', () => {
    it('should withdraw funds from an account successfully', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);
      const account = await createTestAccount(user._id, { balance: 100 });

      const res = await request(app)
        .post('/api/v1/transactions/withdraw')
        .set(authHeader)
        .send({
          accountId: account._id.toString(),
          amount: 40,
          description: 'Test Withdraw'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/successful/i);
      expect(res.body.account.balance).toBe(60);

      // Verify DB Account
      const dbAccount = await Account.findById(account._id);
      expect(dbAccount.balance).toBe(60);
    });

    it('should return 400 when withdrawing with insufficient funds', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);
      const account = await createTestAccount(user._id, { balance: 30 });

      const res = await request(app)
        .post('/api/v1/transactions/withdraw')
        .set(authHeader)
        .send({
          accountId: account._id.toString(),
          amount: 50,
          description: 'Overdraft'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/insufficient funds/i);

      // Verify DB Account remains unchanged
      const dbAccount = await Account.findById(account._id);
      expect(dbAccount.balance).toBe(30);
    });
  });

  describe('POST /api/v1/transactions/transfer', () => {
    it('should transfer funds from sender to receiver successfully', async () => {
      const { user: senderUser } = await createTestUser();
      const { user: receiverUser } = await createTestUser();
      const authHeader = getAuthHeader(senderUser._id);

      const senderAccount = await createTestAccount(senderUser._id, { balance: 200 });
      const receiverAccount = await createTestAccount(receiverUser._id, { balance: 50 });

      const res = await request(app)
        .post('/api/v1/transactions/transfer')
        .set(authHeader)
        .send({
          senderAccountId: senderAccount._id.toString(),
          receiverAccountId: receiverAccount._id.toString(),
          amount: 120,
          description: 'Rent'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/successful/i);

      // Verify balances in DB
      const dbSender = await Account.findById(senderAccount._id);
      const dbReceiver = await Account.findById(receiverAccount._id);
      expect(dbSender.balance).toBe(80);
      expect(dbReceiver.balance).toBe(170);

      // Verify transaction records
      const tx = await Transaction.findOne({ senderAccount: senderAccount._id, receiverAccount: receiverAccount._id });
      expect(tx).toBeTruthy();
      expect(tx.amount).toBe(120);
      expect(tx.balanceBefore).toBe(200);
      expect(tx.balanceAfter).toBe(80);
    });

    it('should return 400 when transferring with insufficient funds', async () => {
      const { user: senderUser } = await createTestUser();
      const { user: receiverUser } = await createTestUser();
      const authHeader = getAuthHeader(senderUser._id);

      const senderAccount = await createTestAccount(senderUser._id, { balance: 10 });
      const receiverAccount = await createTestAccount(receiverUser._id, { balance: 50 });

      const res = await request(app)
        .post('/api/v1/transactions/transfer')
        .set(authHeader)
        .send({
          senderAccountId: senderAccount._id.toString(),
          receiverAccountId: receiverAccount._id.toString(),
          amount: 20,
          description: 'Too high'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/insufficient balance/i);
    });

    it('should return 400 when trying to self-transfer to the same account', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);
      const account = await createTestAccount(user._id, { balance: 100 });

      const res = await request(app)
        .post('/api/v1/transactions/transfer')
        .set(authHeader)
        .send({
          senderAccountId: account._id.toString(),
          receiverAccountId: account._id.toString(),
          amount: 50,
          description: 'Self-transfer'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/same/i);
    });
  });
});
