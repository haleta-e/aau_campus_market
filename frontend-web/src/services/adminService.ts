import { API_BASE_URL, ApiError } from '../config/api';
import { loadAuthFromStorage } from '../context/AuthContext';
import type {
  AdminStats,
  AdminUser,
  AdminOrder,
  AuditLogsResponse,
  AdminComplaint,
  UpdateUserStatusPayload,
  ResolveComplaintPayload,
} from '../types/admin';

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

/** GET /api/v1/admin/stats */
export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiRequest<{ status: string; data: AdminStats }>('/admin/stats');
  return res.data;
}

/** GET /api/v1/admin/users */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await apiRequest<{ status: string; data: AdminUser[] }>('/admin/users');
  return res.data;
}

/**
 * PATCH /api/v1/admin/users/:id/status
 * Valid statuses: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED'
 */
export async function updateUserStatus(
  userId: string,
  payload: UpdateUserStatusPayload,
): Promise<AdminUser> {
  const res = await apiRequest<{ status: string; data: AdminUser }>(
    `/admin/users/${userId}/status`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  );
  return res.data;
}

/** GET /api/v1/admin/orders */
export async function getAdminOrders(): Promise<AdminOrder[]> {
  const res = await apiRequest<{ status: string; data: AdminOrder[] }>('/admin/orders');
  return res.data;
}

/**
 * GET /api/v1/admin/audit-logs
 * Supports: page, limit, action, entity_type query params
 */
export async function getAuditLogs(
  params: { page?: number; limit?: number; action?: string; entity_type?: string } = {},
): Promise<AuditLogsResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.action) qs.set('action', params.action);
  if (params.entity_type) qs.set('entity_type', params.entity_type);
  const query = qs.toString() ? `?${qs.toString()}` : '';
  const res = await apiRequest<AuditLogsResponse>(`/admin/audit-logs${query}`);
  return res;
}

/** GET /api/v1/complaints/admin — all complaints across the system */
export async function getAdminComplaints(): Promise<AdminComplaint[]> {
  const res = await apiRequest<{ status: string; data: AdminComplaint[] }>('/complaints/admin');
  return res.data;
}

/**
 * PATCH /api/v1/complaints/:id/resolve
 * status: 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'CLOSED'
 * resolution: string (min 5 chars)
 */
export async function resolveComplaint(
  complaintId: string,
  payload: ResolveComplaintPayload,
): Promise<AdminComplaint> {
  const res = await apiRequest<{ status: string; data: AdminComplaint }>(
    `/complaints/${complaintId}/resolve`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  );
  return res.data;
}

/**
 * PATCH /api/v1/products/:id — Admin can update product fields
 * Supported fields: name, description, category, price, stock_quantity, status
 */
export async function adminUpdateProduct(
  productId: string,
  updates: {
    name?: string;
    description?: string;
    category?: string;
    price?: number;
    stock_quantity?: number;
    status?: 'ACTIVE' | 'INACTIVE';
  },
): Promise<unknown> {
  const res = await apiRequest<{ status: string; data: unknown }>(
    `/products/${productId}`,
    { method: 'PATCH', body: JSON.stringify(updates) },
  );
  return res.data;
}

/**
 * DELETE /api/v1/products/:id — Admin can soft-deactivate a product
 */
export async function adminDeleteProduct(productId: string): Promise<void> {
  await apiRequest<unknown>(`/products/${productId}`, { method: 'DELETE' });
}
