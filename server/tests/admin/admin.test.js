import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/user.model.js';
import { createTestUser, getAuthHeader } from '../helpers/testUtils.js';

describe('Admin Endpoints', () => {
  describe('Admin Access Control', () => {
    it('should allow access to admin routes for admin users', async () => {
      const { user: adminUser } = await createTestUser({ role: 'admin' });
      const authHeader = getAuthHeader(adminUser._id);

      const res = await request(app)
        .get('/api/v1/admin/users')
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });

    it('should return 403 Forbidden for non-admin users trying to access admin routes', async () => {
      const { user: normalUser } = await createTestUser({ role: 'customer' });
      const authHeader = getAuthHeader(normalUser._id);

      const res = await request(app)
        .get('/api/v1/admin/users')
        .set(authHeader);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not authorized|forbidden|access denied/i);
    });
  });

  describe('PATCH /api/v1/admin/users/:id/block', () => {
    it('should block a user successfully', async () => {
      const { user: adminUser } = await createTestUser({ role: 'admin' });
      const { user: targetUser } = await createTestUser({ role: 'customer' });
      const authHeader = getAuthHeader(adminUser._id);

      const res = await request(app)
        .patch(`/api/v1/admin/users/${targetUser._id}/block`)
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isBlocked).toBe(true);

      // Verify in DB
      const dbUser = await User.findById(targetUser._id);
      expect(dbUser.isBlocked).toBe(true);
    });

    it('should prevent a blocked user from accessing protected routes', async () => {
      const { user: normalUser } = await createTestUser({ isBlocked: true });
      const authHeader = getAuthHeader(normalUser._id);

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set(authHeader);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/blocked/i);
    });

    it('should prevent a blocked user from logging in', async () => {
      const password = 'Password123!';
      const { user: normalUser } = await createTestUser({ password, isBlocked: true });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: normalUser.email,
          password
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/blocked/i);
    });
  });

  describe('PATCH /api/v1/admin/users/:id/unblock', () => {
    it('should unblock a user successfully', async () => {
      const { user: adminUser } = await createTestUser({ role: 'admin' });
      const { user: targetUser } = await createTestUser({ role: 'customer', isBlocked: true });
      const authHeader = getAuthHeader(adminUser._id);

      const res = await request(app)
        .patch(`/api/v1/admin/users/${targetUser._id}/unblock`)
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isBlocked).toBe(false);

      // Verify in DB
      const dbUser = await User.findById(targetUser._id);
      expect(dbUser.isBlocked).toBe(false);
    });
  });

  describe('GET /api/v1/admin/overview', () => {
    it('should return system stats overview successfully', async () => {
      const { user: adminUser } = await createTestUser({ role: 'admin' });
      const authHeader = getAuthHeader(adminUser._id);

      const res = await request(app)
        .get('/api/v1/admin/overview')
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.users).toBeDefined();
      expect(res.body.data.accounts).toBeDefined();
      expect(res.body.data.transactions).toBeDefined();
    });
  });
});
