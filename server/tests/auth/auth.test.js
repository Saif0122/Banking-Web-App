import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/user.model.js';
import { createTestUser, getAuthHeader } from '../helpers/testUtils.js';

describe('Auth Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const userData = {
        name: 'Register User',
        email: `newuser_${uniqueSuffix}@example.com`,
        password: 'Password123!',
        role: 'customer'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(userData.email.toLowerCase());
      expect(res.body.user.name).toBe(userData.name);
      expect(res.body.user.password).toBeUndefined();
      expect(res.body.token).toBeDefined();

      // Check DB
      const user = await User.findOne({ email: userData.email.toLowerCase() });
      expect(user).toBeTruthy();
      expect(user.name).toBe(userData.name);
    });

    it('should return 400 for duplicate email', async () => {
      const { user } = await createTestUser();
      const userData = {
        name: 'Duplicate User',
        email: user.email,
        password: 'Password123!',
        role: 'customer'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered|duplicate/i);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should log in a user with valid credentials and return a token', async () => {
      const password = 'Password123!';
      const { user } = await createTestUser({ password });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(user.email);
    });

    it('should return 401 for an invalid password', async () => {
      const { user } = await createTestUser();

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: 'WrongPassword123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid/i);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should allow access to a protected route with a valid access token', async () => {
      const { user } = await createTestUser();
      const authHeader = getAuthHeader(user._id);

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(user.email);
    });

    it('should return 401 when accessing a protected route without a token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/missing|token/i);
    });

    it('should return 401 when accessing a protected route with an invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/validation failed|invalid/i);
    });
  });
});
