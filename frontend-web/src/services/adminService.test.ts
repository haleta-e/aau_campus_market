import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as adminService from './adminService';

const mockStats = {
  total_users: 42,
  total_sellers: 5,
  total_products: 120,
  total_orders: 88,
  total_complaints: 3,
  total_revenue_etb: '45600.00',
};

const mockUsers = [
  { id: 'u1', email: 'admin@aau.et', username: 'admin', role: 'ADMIN', status: 'ACTIVE', created_at: '2026-01-01T00:00:00Z', store_name: null },
  { id: 'u2', email: 'seller@aau.et', username: 'seller1', role: 'SELLER', status: 'ACTIVE', created_at: '2026-01-02T00:00:00Z', store_name: 'AAU Bookshop' },
];

const mockOrders = [
  {
    id: 'o1', order_number: 'ORD-001', buyer_id: 'b1', buyer_username: 'buyer1',
    buyer_email: 'buyer1@aau.et', seller_id: 's1', store_name: 'AAU Bookshop',
    status: 'COMPLETED', payment_status: 'SUCCESS', total_amount: '250.00',
    created_at: '2026-10-01T08:00:00Z', accepted_at: null, completed_at: '2026-10-01T09:00:00Z',
  },
];

const mockComplaints = [
  {
    id: 'c1', complaint_number: 'CMP-001', order_id: 'o1', buyer_id: 'b1',
    seller_id: 's1', admin_id: null, subject: 'Wrong item delivered',
    description: 'I received the wrong book.', status: 'OPEN', priority: 'HIGH',
    resolution: null, created_at: '2026-10-05T10:00:00Z', updated_at: '2026-10-05T10:00:00Z', resolved_at: null,
  },
];

describe('adminService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getAdminStats — returns stats from /admin/stats', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: mockStats }),
    } as Response);

    const result = await adminService.getAdminStats();
    expect(result).toEqual(mockStats);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/stats'),
      expect.objectContaining({ headers: expect.any(Object) })
    );
  });

  it('getAdminUsers — returns user list from /admin/users', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: mockUsers }),
    } as Response);

    const result = await adminService.getAdminUsers();
    expect(result).toHaveLength(2);
    expect(result[0].role).toBe('ADMIN');
  });

  it('updateUserStatus — sends PATCH to /admin/users/:id/status', async () => {
    const updated = { ...mockUsers[1], status: 'SUSPENDED' };
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: updated }),
    } as Response);

    const result = await adminService.updateUserStatus('u2', { status: 'SUSPENDED' });
    expect(result.status).toBe('SUSPENDED');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/users/u2/status'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'SUSPENDED' }),
      })
    );
  });

  it('getAdminOrders — returns orders from /admin/orders', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: mockOrders }),
    } as Response);

    const result = await adminService.getAdminOrders();
    expect(result).toHaveLength(1);
    expect(result[0].order_number).toBe('ORD-001');
  });

  it('getAdminComplaints — returns complaints from /complaints/admin', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: mockComplaints }),
    } as Response);

    const result = await adminService.getAdminComplaints();
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe('HIGH');
  });

  it('resolveComplaint — sends PATCH to /complaints/:id/resolve', async () => {
    const payload = { status: 'RESOLVED' as const, resolution: 'Replacement sent to student.' };
    const resolved = { ...mockComplaints[0], status: 'RESOLVED', resolution: payload.resolution };
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: resolved }),
    } as Response);

    const result = await adminService.resolveComplaint('c1', payload);
    expect(result.status).toBe('RESOLVED');
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/complaints/c1/resolve'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
    );
  });

  it('adminUpdateProduct — sends PATCH to /products/:id', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: { id: 'p1', stock_quantity: 10 } }),
    } as Response);

    const result = await adminService.adminUpdateProduct('p1', { stock_quantity: 10, price: 150, status: 'ACTIVE' });
    expect(result).toBeTruthy();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/products/p1'),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ stock_quantity: 10, price: 150, status: 'ACTIVE' }),
      })
    );
  });

  it('adminDeleteProduct — sends DELETE to /products/:id', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success' }),
    } as Response);

    await expect(adminService.adminDeleteProduct('p1')).resolves.toBeUndefined();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/products/p1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
