import { API_BASE_URL, ApiError } from '../config/api';
import { LoginCredentials, LoginResponseData, User } from '../types/auth';

export class AuthService {
  /**
   * Authenticate with username or email and password
   * POST /api/v1/auth/login
   */
  async login(credentials: LoginCredentials): Promise<LoginResponseData> {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(credentials),
      });
    } catch (networkError) {
      throw new ApiError(
        'Unable to connect to authentication service. Please check your network.',
        0,
        'NETWORK_ERROR'
      );
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError('Unexpected server response format', response.status, 'INVALID_RESPONSE');
    }

    if (!response.ok) {
      const errorMessage = payload?.message || 'Authentication failed. Please check your credentials.';
      const errorCode = payload?.code || 'AUTH_ERROR';
      throw new ApiError(errorMessage, response.status, errorCode, payload?.errors);
    }

    if (payload.status !== 'success' || !payload.data) {
      throw new ApiError('Malformed authentication response', 500, 'MALFORMED_DATA');
    }

    return payload.data as LoginResponseData;
  }

  /**
   * Invalidate the current session and refresh token
   * POST /api/v1/auth/logout
   */
  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken: refreshToken || '' }),
      });
    } catch {
      // Best-effort logout; client credentials should still be cleared even if backend call fails
    }
  }

  /**
   * Fetch current authenticated user profile
   * GET /api/v1/auth/me
   */
  async getMe(accessToken: string): Promise<User> {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch {
      throw new ApiError('Unable to verify session with server.', 0, 'NETWORK_ERROR');
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError('Unexpected response from session verification.', response.status, 'INVALID_RESPONSE');
    }

    if (!response.ok) {
      throw new ApiError(payload?.message || 'Session verification failed.', response.status, payload?.code);
    }

    return payload.data?.user as User;
  }
}

export const authService = new AuthService();
