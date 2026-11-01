import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderService } from './orderService';

describe('orderService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('successfully places an order with valid token and payload', async () => {
    const mockOrder = {
      id: 'ord-123',
      order_number: 'ORD-20261031-1001',
      buyer_id: 'u-1',
      seller_id: 's-1',
      status: 'PENDING',
      total_amount: '900.00',
      payment_status: 'PENDING',
      created_at: '2026-10-31T10:00:00.000Z',
      updated_at: '2026-10-31T10:00:00.000Z',
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ status: 'success', data: mockOrder }),
    } as Response);

    const result = await orderService.placeOrder(
      {
        seller_id: 's-1',
        items: [{ product_id: 'p-1', quantity: 2 }],
      },
      'valid-token'
    );

    expect(result.id).toBe('ord-123');
    expect(result.order_number).toBe('ORD-20261031-1001');
    expect(result.total_amount).toBe('900.00');
  });

  it('throws ApiError when order placement fails with 409 INSUFFICIENT_STOCK', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        status: 'error',
        code: 'INSUFFICIENT_STOCK',
        message: 'Insufficient stock for product p-1',
      }),
    } as Response);

    await expect(
      orderService.placeOrder(
        {
          seller_id: 's-1',
          items: [{ product_id: 'p-1', quantity: 99 }],
        },
        'valid-token'
      )
    ).rejects.toThrow('Insufficient stock for product p-1');
  });

  it('processes payment for an existing order', async () => {
    const mockTransaction = {
      id: 'tx-1',
      order_id: 'ord-123',
      buyer_id: 'u-1',
      seller_id: 's-1',
      amount: '900.00',
      payment_method: 'TELEBIRR',
      status: 'SUCCESS',
      reference: 'TX-REF-1001',
      created_at: '2026-10-31T10:01:00.000Z',
    };

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: mockTransaction }),
    } as Response);

    const result = await orderService.processPayment(
      { order_id: 'ord-123', payment_method: 'TELEBIRR' },
      'valid-token'
    );

    expect(result.reference).toBe('TX-REF-1001');
    expect(result.payment_method).toBe('TELEBIRR');
  });

  it('fetches order history with getMyOrders()', async () => {
    const mockOrders = [
      {
        id: 'ord-1',
        order_number: 'ORD-001',
        total_amount: '450.00',
        status: 'PENDING',
        payment_status: 'PENDING',
      },
    ];

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ status: 'success', data: mockOrders }),
    } as Response);

    const list = await orderService.getMyOrders('valid-token');
    expect(list).toHaveLength(1);
    expect(list[0].order_number).toBe('ORD-001');
  });
});
