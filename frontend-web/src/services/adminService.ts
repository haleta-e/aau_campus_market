import { API_BASE_URL, ApiError } from '../config/api';
import { loadAuthFromStorage } from '../context/AuthContext';

/**
 * Low-level authenticated API request helper.
 * Injects JWT Bearer token from localStorage and parses response payload.
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = loadAuthFromStorage()?.token;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError('Unable to connect to administration service.', 0, 'NETWORK_ERROR');
  }

  let payload: any;
  try {
    payload = await response.json();
  } catch {
    if (response.ok) return undefined as unknown as T;
    throw new ApiError('Unexpected server response format', response.status, 'INVALID_RESPONSE');
  }

  if (!response.ok) {
    const msg = payload?.message || 'Administrative request failed';
    throw new ApiError(msg, response.status, payload?.code, payload?.errors);
  }

  return payload as T;
}
