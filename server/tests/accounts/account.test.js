import request from 'supertest';
import app from '../../src/app.js';
import Account from '../../src/models/account.model.js';
import { createTestUser, getAuthHeader, createTestAccount } from '../helpers/testUtils.js';

describe('Account Endpoints', () => {
  describe('POST /api/v1/accounts', () => {
    it('should create a savings account successfully', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);

      const res = await request(app)
        .post('/api/v1/accounts')
        .set(authHeader)
        .send({ accountType: 'savings' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.account).toBeDefined();
      expect(res.body.account.accountType).toBe('savings');
      expect(res.body.account.balance).toBe(0);
      expect(res.body.account.accountNumber).toHaveLength(10);
      expect(res.body.account.owner.toString()).toBe(user._id.toString());

      // Check DB
      const dbAccount = await Account.findById(res.body.account._id);
      expect(dbAccount).toBeTruthy();
      expect(dbAccount.accountType).toBe('savings');
    });

    it('should create a current account successfully', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);

      const res = await request(app)
        .post('/api/v1/accounts')
        .set(authHeader)
        .send({ accountType: 'current' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.account).toBeDefined();
      expect(res.body.account.accountType).toBe('current');
      expect(res.body.account.balance).toBe(0);
      expect(res.body.account.accountNumber).toHaveLength(10);

      // Check DB
      const dbAccount = await Account.findById(res.body.account._id);
      expect(dbAccount).toBeTruthy();
      expect(dbAccount.accountType).toBe('current');
    });

    it('should return 400 for invalid account type', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);

      const res = await request(app)
        .post('/api/v1/accounts')
        .set(authHeader)
        .send({ accountType: 'invalid_type' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/accounttype/i);
    });
  });

  describe('GET /api/v1/accounts', () => {
    it('should retrieve all accounts belonging to the authenticated user', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);

      await createTestAccount(user._id, { accountType: 'savings' });
      await createTestAccount(user._id, { accountType: 'current' });

      const res = await request(app)
        .get('/api/v1/accounts')
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.accounts).toHaveLength(2);
    });
  });

  describe('GET /api/v1/accounts/:id', () => {
    it('should retrieve a single account owned by the user', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);
      const account = await createTestAccount(user._id);

      const res = await request(app)
        .get(`/api/v1/accounts/${account._id}`)
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.account._id.toString()).toBe(account._id.toString());
      expect(res.body.account.accountNumber).toBe(account.accountNumber);
    });

    it('should return 403 when trying to access another user\'s account', async () => {
      const { user: userA } = await createTestUser();
      const { user: userB } = await createTestUser();
      const authHeaderA = getAuthHeader(userA._id);
      const accountB = await createTestAccount(userB._id);

      const res = await request(app)
        .get(`/api/v1/accounts/${accountB._id}`)
        .set(authHeaderA);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    it('should return 404 for non-existent account ID', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);
      const nonExistentId = '66708f51a89c25fb18b8de31'; // random valid ObjectId

      const res = await request(app)
        .get(`/api/v1/accounts/${nonExistentId}`)
        .set(authHeader);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  describe('Unauthorized access scenarios', () => {
    it('should return 401 when fetching account details without a token', async () => {
      const { user } = await createTestUser();
      const account = await createTestAccount(user._id);

      const res = await request(app)
        .get(`/api/v1/accounts/${account._id}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
