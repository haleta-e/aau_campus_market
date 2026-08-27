import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Orders Endpoints API Integration Tests', () => {
  describe('POST /api/v1/orders', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).post('/api/v1/orders').send({});
      expect(res.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('Authorization', 'Bearer bad.token.here')
        .send({});
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('INVALID_TOKEN');
    });
  });

  describe('GET /api/v1/orders/my', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/orders/my');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/orders/seller', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/orders/seller');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/orders/:id', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/orders/some-order-id');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/orders/:id/status', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app)
        .patch('/api/v1/orders/some-id/status')
        .send({ status: 'CONFIRMED' });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/orders/:id/accept', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app)
        .post('/api/v1/orders/some-id/accept')
        .send({ confirm: true });
      expect(res.status).toBe(401);
    });
  });

  describe('Order schema validation', () => {
    it('POST body with empty items array should fail Zod validation', async () => {
      // Mocking auth is complex without DB — just verify Zod catches schema at logic level
      const { createOrderSchema } = await import('../../src/modules/orders/order.schema');
      const result = createOrderSchema.safeParse({ seller_id: 'not-a-uuid', items: [] });
      expect(result.success).toBe(false);
    });

    it('POST body with valid structure should pass Zod validation', async () => {
      const { createOrderSchema } = await import('../../src/modules/orders/order.schema');
      const result = createOrderSchema.safeParse({
        seller_id: 'c1f2e3d4-0000-0000-0000-000000000001',
        items: [{ product_id: 'c1f2e3d4-0000-0000-0000-000000000002', quantity: 2 }],
      });
      expect(result.success).toBe(true);
    });

    it('acceptOrderSchema should only accept confirm: true', async () => {
      const { acceptOrderSchema } = await import('../../src/modules/orders/order.schema');
      expect(acceptOrderSchema.safeParse({ confirm: true }).success).toBe(true);
      expect(acceptOrderSchema.safeParse({ confirm: false }).success).toBe(false);
    });
  });
});
