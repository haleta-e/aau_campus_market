import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';

describe('authService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully logs in with valid credentials', async () => {
    const mockData = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      user: {
        id: 'u-1',
        username: 'testbuyer',
        email: 'buyer@aau.edu.et',
        role: 'BUYER',
        status: 'ACTIVE',
      },
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: mockData }),
    } as Response);

    const result = await authService.login({
      usernameOrEmail: 'testbuyer',
      password: 'password123',
    });

    expect(result.accessToken).toBe('test-access-token');
    expect(result.user.username).toBe('testbuyer');
    expect(result.user.role).toBe('BUYER');
  });

  it('throws ApiError with status 401 on invalid credentials', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password',
      }),
    } as Response);

    await expect(
      authService.login({ usernameOrEmail: 'wrong', password: 'bad' })
    ).rejects.toThrow('Invalid username or password');
  });

  it('throws ApiError on network connection failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Network failure'));

    await expect(
      authService.login({ usernameOrEmail: 'testbuyer', password: 'password123' })
    ).rejects.toThrow(/Unable to connect to authentication service/);
  });

  it('fetches current user profile with getMe()', async () => {
    const mockUser = {
      id: 'u-1',
      username: 'testbuyer',
      email: 'buyer@aau.edu.et',
      role: 'BUYER',
      status: 'ACTIVE',
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: { user: mockUser } }),
    } as Response);

    const user = await authService.getMe('valid-token');
    expect(user.username).toBe('testbuyer');
    expect(user.email).toBe('buyer@aau.edu.et');
  });
});
