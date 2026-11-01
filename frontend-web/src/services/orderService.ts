import { API_BASE_URL, ApiError } from '../config/api';
import {
  CreateOrderDTO,
  BackendOrder,
  ProcessPaymentDTO,
  TransactionResult,
} from '../types/order';

export class OrderService {
  /**
   * Submit an order to the backend API (BUYER only)
   * POST /api/v1/orders
   */
  async placeOrder(dto: CreateOrderDTO, token: string): Promise<BackendOrder> {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });
    } catch {
      throw new ApiError(
        'Unable to connect to order service. Your order was not submitted.',
        0,
        'NETWORK_ERROR'
      );
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError('Unexpected response from order service.', response.status, 'INVALID_RESPONSE');
    }

    if (!response.ok) {
      const message = payload?.message || 'Failed to place order.';
      throw new ApiError(message, response.status, payload?.code);
    }

    if (payload.status !== 'success' || !payload.data) {
      throw new ApiError('Malformed order creation response', 500, 'MALFORMED_DATA');
    }

    return payload.data as BackendOrder;
  }

  /**
   * Process payment for an existing order (BUYER only)
   * POST /api/v1/payments/process
   */
  async processPayment(dto: ProcessPaymentDTO, token: string): Promise<TransactionResult> {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      });
    } catch {
      throw new ApiError(
        'Order was created, but unable to contact payment service.',
        0,
        'PAYMENT_NETWORK_ERROR'
      );
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError('Unexpected response from payment service.', response.status, 'INVALID_RESPONSE');
    }

    if (!response.ok) {
      throw new ApiError(payload?.message || 'Payment processing failed.', response.status, payload?.code);
    }

    return payload.data as TransactionResult;
  }

  /**
   * Fetch order history for the current authenticated buyer
   * GET /api/v1/orders/my
   */
  async getMyOrders(token: string): Promise<BackendOrder[]> {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/orders/my`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      throw new ApiError('Unable to load orders. Please check your network connection.', 0, 'NETWORK_ERROR');
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError('Unexpected response from order history.', response.status, 'INVALID_RESPONSE');
    }

    if (!response.ok) {
      throw new ApiError(payload?.message || 'Failed to retrieve orders.', response.status, payload?.code);
    }

    return (payload.data || []) as BackendOrder[];
  }

  /**
   * Fetch full order details including line items
   * GET /api/v1/orders/:id
   */
  async getOrderDetail(id: string, token: string): Promise<BackendOrder> {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      throw new ApiError('Unable to load order details.', 0, 'NETWORK_ERROR');
    }

    let payload: any;
    try {
      payload = await response.json();
    } catch {
      throw new ApiError('Unexpected response format.', response.status, 'INVALID_RESPONSE');
    }

    if (!response.ok) {
      throw new ApiError(payload?.message || 'Order not found.', response.status, payload?.code);
    }

    return payload.data as BackendOrder;
  }

  /**
   * Confirm order receipt (BUYER only)
   * POST /api/v1/orders/:id/accept
   */
  async acceptOrder(id: string, token: string): Promise<BackendOrder> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ confirm: true }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new ApiError(payload?.message || 'Unable to accept order.', response.status, payload?.code);
    }

    return payload.data as BackendOrder;
  }
}

export const orderService = new OrderService();
