import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateAccessToken, generateRefreshToken, hashToken, verifyAccessToken, JwtPayload } from '../../src/utils/jwt.util';

// Use test env values
process.env.JWT_SECRET = 'test-jwt-secret-key-for-vitest-unit-tests';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

const samplePayload: JwtPayload = {
  userId: 'c1f2e3d4-0000-0000-0000-000000000001',
  role: 'BUYER',
  username: 'buyer01',
};

describe('JWT Utility Unit Tests', () => {
  it('should generate a valid JWT access token string', () => {
    const token = generateAccessToken(samplePayload);
    expect(typeof token).toBe('string');
    // JWT format: header.payload.signature
    expect(token.split('.')).toHaveLength(3);
  });

  it('should verify and decode a valid access token correctly', () => {
    const token = generateAccessToken(samplePayload);
    const decoded = verifyAccessToken(token);

    expect(decoded.userId).toBe(samplePayload.userId);
    expect(decoded.role).toBe(samplePayload.role);
    expect(decoded.username).toBe(samplePayload.username);
  });

  it('should throw an error when verifying an invalid token', () => {
    expect(() => verifyAccessToken('invalid.bad.token')).toThrow();
  });

  it('should generate a unique random refresh token string each call', () => {
    const token1 = generateRefreshToken();
    const token2 = generateRefreshToken();
    expect(token1).not.toBe(token2);
    expect(token1.length).toBeGreaterThan(20);
  });

  it('should produce consistent SHA-256 hash for the same token', () => {
    const rawToken = 'my-test-refresh-token-value';
    const hash1 = hashToken(rawToken);
    const hash2 = hashToken(rawToken);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64); // SHA-256 hex = 64 chars
  });

  it('should produce different hashes for different tokens', () => {
    const hash1 = hashToken('token-aaa-111');
    const hash2 = hashToken('token-bbb-222');
    expect(hash1).not.toBe(hash2);
  });
});
