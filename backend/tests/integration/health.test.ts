import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Health & Service Endpoints API Integration Tests', () => {
  it('GET /health should return status JSON object', async () => {
    const res = await request(app).get('/health');
    expect([200, 500]).toContain(res.status);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('services');
  });

  it('GET /ready should return HTTP 200 ready status', async () => {
    const res = await request(app).get('/ready');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ready');
  });

  it('GET /api/v1 should return HTTP 200 API v1 active payload', async () => {
    const res = await request(app).get('/api/v1');
    expect(res.status).toBe(200);
    expect(res.body.version).toBe('v1');
    expect(res.body.message).toContain('AAU Campus Market');
  });

  it('GET /non-existent-route should return HTTP 404', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('NOT_FOUND');
  });
});
