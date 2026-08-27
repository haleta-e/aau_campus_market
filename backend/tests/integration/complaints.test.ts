import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Complaints Endpoints API Integration Tests', () => {
  describe('POST /api/v1/complaints', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).post('/api/v1/complaints').send({
        order_id: 'c1f2e3d4-0000-0000-0000-000000000001',
        subject: 'Defective item',
        description: 'The item stopped working after 1 hour',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/complaints/my', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/complaints/my');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/complaints/seller', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/complaints/seller');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/complaints/admin', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/complaints/admin');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/complaints/:id', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/v1/complaints/c1f2e3d4-0000-0000-0000-000000000001');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/complaints/:id/messages', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app)
        .post('/api/v1/complaints/c1f2e3d4-0000-0000-0000-000000000001/messages')
        .send({ message: 'I have photos of the damage' });
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/v1/complaints/:id/resolve', () => {
    it('should return 401 when unauthenticated', async () => {
      const res = await request(app)
        .patch('/api/v1/complaints/c1f2e3d4-0000-0000-0000-000000000001/resolve')
        .send({ status: 'RESOLVED', resolution: 'Refund processed to buyer' });
      expect(res.status).toBe(401);
    });
  });

  describe('Complaint schema validation', () => {
    it('should reject short subject and description', async () => {
      const { createComplaintSchema } = await import('../../src/modules/complaints/complaint.schema');
      const invalid = createComplaintSchema.safeParse({
        order_id: 'c1f2e3d4-0000-0000-0000-000000000001',
        subject: 'No',
        description: 'Short',
      });
      expect(invalid.success).toBe(false);
    });

    it('should accept valid complaint payload', async () => {
      const { createComplaintSchema } = await import('../../src/modules/complaints/complaint.schema');
      const valid = createComplaintSchema.safeParse({
        order_id: 'c1f2e3d4-0000-0000-0000-000000000001',
        subject: 'Defective screen on arrival',
        description: 'The laptop screen has multiple dead pixels upon unboxing.',
        priority: 'HIGH',
      });
      expect(valid.success).toBe(true);
    });
  });
});
