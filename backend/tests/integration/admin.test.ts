import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Admin Endpoints API Integration Tests', () => {
  describe('GET /api/v1/admin/stats', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/admin/stats');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/admin/audit-logs', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/admin/audit-logs');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/admin/users');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/admin/orders', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/admin/orders');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/admin/users/:id/status', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app)
        .patch('/api/v1/admin/users/c1f2e3d4-0000-0000-0000-000000000001/status')
        .send({ status: 'SUSPENDED' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /admin static dashboard route', () => {
    it('should serve HTML dashboard', async () => {
      const res = await request(app).get('/admin');
      expect(res.status).toBe(200);
      expect(res.text).toContain('AAU Admin Portal');
    });
  });
});
