import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { AuthProvider, useAuth, AUTH_STORAGE_KEY } from './AuthContext';
import { authService } from '../services/authService';
import { User } from '../types/auth';

const sampleUser: User = {
  id: 'usr-123',
  username: 'abebe_b',
  email: 'abebe@aau.edu.et',
  role: 'BUYER',
  status: 'ACTIVE',
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with unauthenticated state when no session stored', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('restores stored session from localStorage on initialization', async () => {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        token: 'stored-token-123',
        refreshToken: 'stored-refresh-456',
        user: sampleUser,
      })
    );

    // Mock getMe to resolve with the latest user
    vi.spyOn(authService, 'getMe').mockResolvedValue(sampleUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.username).toBe('abebe_b');
    expect(result.current.token).toBe('stored-token-123');
  });

  it('updates state and persists to localStorage on successful login', async () => {
    vi.spyOn(authService, 'login').mockResolvedValue({
      accessToken: 'jwt-access-token',
      refreshToken: 'refresh-token',
      user: sampleUser,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login({
        usernameOrEmail: 'abebe_b',
        password: 'password123',
      });
    });

    expect(loginResult.success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.username).toBe('abebe_b');
    expect(result.current.token).toBe('jwt-access-token');

    const stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || '{}');
    expect(stored.token).toBe('jwt-access-token');
    expect(stored.user.id).toBe('usr-123');
  });

  it('returns failure message on unsuccessful login without modifying session', async () => {
    vi.spyOn(authService, 'login').mockRejectedValue({
      message: 'Invalid username or password',
      statusCode: 401,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult: any;
    await act(async () => {
      loginResult = await result.current.login({
        usernameOrEmail: 'wrong_user',
        password: 'bad_password',
      });
    });

    expect(loginResult.success).toBe(false);
    expect(loginResult.message).toBe('Invalid username or password');
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('clears state and localStorage on logout', async () => {
    vi.spyOn(authService, 'logout').mockResolvedValue(undefined);

    const initialWrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider initialUser={sampleUser} initialToken="some-token">
        {children}
      </AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: initialWrapper });

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('evaluates role permissions correctly with hasRole()', () => {
    const buyerWrapper = ({ children }: { children: ReactNode }) => (
      <AuthProvider initialUser={sampleUser} initialToken="token-123">
        {children}
      </AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper: buyerWrapper });

    expect(result.current.hasRole('BUYER')).toBe(true);
    expect(result.current.hasRole('SELLER')).toBe(false);
    expect(result.current.hasRole(['SELLER', 'BUYER'])).toBe(true);
    expect(result.current.hasRole(['ADMIN'])).toBe(false);
  });

  it('safely recovers from malformed localStorage data', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'corrupted{{invalid-json');

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});
