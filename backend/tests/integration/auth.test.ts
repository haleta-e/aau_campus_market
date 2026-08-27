import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('Auth Endpoints API Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should return 400 for missing required fields', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({});
      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid email format', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        username: 'testuser',
        email: 'not-an-email',
        password: 'Pass@123456',
      });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for password shorter than 6 characters', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        username: 'testuser',
        email: 'testuser@aau.edu.et',
        password: '123',
      });
      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 400 for missing login fields', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({});
      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    it('should return 400 when refreshToken body field is missing', async () => {
      const res = await request(app).post('/api/v1/auth/refresh-token').send({});
      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 401 when no Authorization header is provided', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 for invalid Bearer token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid.jwt.token');
      expect(res.status).toBe(401);
      expect(res.body.code).toBe('INVALID_TOKEN');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return 401 when no Authorization header is provided', async () => {
      const res = await request(app).post('/api/v1/auth/logout').send({});
      expect(res.status).toBe(401);
    });
  });
});
