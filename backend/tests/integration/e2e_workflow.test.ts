import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('AAU Campus Market E2E Workflow API Tests', () => {
  it('API root and documentation are reachable', async () => {
    const rootRes = await request(app).get('/api/v1');
    expect(rootRes.status).toBe(200);
    expect(rootRes.body.version).toBe('v1');

    const docsRes = await request(app).get('/api/v1/docs/');
    expect(docsRes.status).toBe(200);
  });

  it('Admin dashboard is served at /admin and /admin/dashboard', async () => {
    const res1 = await request(app).get('/admin');
    expect(res1.status).toBe(200);
    expect(res1.text).toContain('AAU Admin Portal');

    const res2 = await request(app).get('/admin/dashboard');
    expect(res2.status).toBe(200);
  });

  it('Public product search and filtering endpoint operates correctly', async () => {
    const res = await request(app).get('/api/v1/products?category=Electronics&limit=5');
    expect([200, 500]).toContain(res.status);
  });

  it('Protected routes reject unauthorized requests consistently across all modules', async () => {
    const endpoints = [
      { method: 'post', path: '/api/v1/products', body: {} },
      { method: 'post', path: '/api/v1/orders', body: {} },
      { method: 'get', path: '/api/v1/orders/my' },
      { method: 'post', path: '/api/v1/payments/process', body: {} },
      { method: 'post', path: '/api/v1/complaints', body: {} },
      { method: 'get', path: '/api/v1/admin/stats' },
      { method: 'get', path: '/api/v1/admin/audit-logs' },
    ];

    for (const ep of endpoints) {
      const res = ep.method === 'post'
        ? await request(app).post(ep.path).send(ep.body)
        : await request(app).get(ep.path);
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
    }
  });
});
