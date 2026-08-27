import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../../src/utils/password.util';

describe('Argon2id Password Utility Unit Tests', () => {
  it('should generate a valid Argon2id hash for a password', async () => {
    const rawPassword = 'DemoPassword@123';
    const hash = await hashPassword(rawPassword);

    expect(hash).toBeDefined();
    expect(hash).toContain('$argon2id$');
    expect(hash.length).toBeGreaterThan(30);
  });

  it('should return true when verifying correct password against hash', async () => {
    const rawPassword = 'DemoPassword@123';
    const hash = await hashPassword(rawPassword);

    const isValid = await verifyPassword(hash, rawPassword);
    expect(isValid).toBe(true);
  });

  it('should return false when verifying incorrect password against hash', async () => {
    const rawPassword = 'DemoPassword@123';
    const wrongPassword = 'WrongPassword@999';
    const hash = await hashPassword(rawPassword);

    const isValid = await verifyPassword(hash, wrongPassword);
    expect(isValid).toBe(false);
  });
});
