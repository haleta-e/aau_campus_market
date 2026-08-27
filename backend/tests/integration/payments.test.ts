import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Payments Endpoints API Integration Tests', () => {
  describe('POST /api/v1/payments/process', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).post('/api/v1/payments/process').send({
        order_id: 'c1f2e3d4-0000-0000-0000-000000000001',
        payment_method: 'MOCK_PAYMENT',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/payments/my', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/payments/my');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/payments/:id', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/payments/c1f2e3d4-0000-0000-0000-000000000001');
      expect(res.status).toBe(401);
    });
  });

  describe('Payment schema validation', () => {
    it('should validate allowed payment methods', async () => {
      const { processPaymentSchema } = await import('../../src/modules/payments/payment.schema');
      const valid = processPaymentSchema.safeParse({
        order_id: 'c1f2e3d4-0000-0000-0000-000000000001',
        payment_method: 'TELEBIRR',
      });
      expect(valid.success).toBe(true);

      const invalid = processPaymentSchema.safeParse({
        order_id: 'c1f2e3d4-0000-0000-0000-000000000001',
        payment_method: 'BITCOIN',
      });
      expect(invalid.success).toBe(false);
    });
  });
});
