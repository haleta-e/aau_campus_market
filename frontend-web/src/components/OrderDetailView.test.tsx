import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderDetailView } from './OrderDetailView';

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 'u1', role: 'BUYER' } }),
}));

vi.mock('../services/orderService', () => ({
  orderService: {
    getOrderDetail: vi.fn(),
  },
}));

import { orderService } from '../services/orderService';

const mockOrder = {
  id: 'order-abc',
  order_number: 'AAU-2026-0099',
  status: 'CONFIRMED',
  payment_status: 'SUCCESS',
  total_amount: '250.00',
  created_at: '2026-10-20T09:30:00.000Z',
  items: [
    {
      id: 'item-1',
      product_id: 'prod-1',
      quantity: 2,
      unit_price: '75.00',
      subtotal: '150.00',
      product_name: 'USB-C Hub',
      product_category: 'Electronics',
    },
    {
      id: 'item-2',
      product_id: 'prod-2',
      quantity: 1,
      unit_price: '100.00',
      subtotal: '100.00',
      product_name: 'Graph Theory Textbook',
      product_category: 'Books',
    },
  ],
};

describe('OrderDetailView', () => {
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (orderService.getOrderDetail as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Promise(() => {})
    );
    render(<OrderDetailView orderId="order-abc" onBack={onBack} />);
    expect(screen.getByTestId('order-detail-loading')).toBeInTheDocument();
  });

  it('renders order details after successful fetch', async () => {
    (orderService.getOrderDetail as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrder);
    render(<OrderDetailView orderId="order-abc" onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByText('AAU-2026-0099')).toBeInTheDocument();
    });

    expect(screen.getByTestId('order-items-table')).toBeInTheDocument();
    expect(screen.getByText('USB-C Hub')).toBeInTheDocument();
    expect(screen.getByText('Graph Theory Textbook')).toBeInTheDocument();
    expect(screen.getByTestId('order-detail-total')).toHaveTextContent('250.00 ETB');
  });

  it('shows error state with retry on failure', async () => {
    (orderService.getOrderDetail as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Order not found')
    );
    render(<OrderDetailView orderId="order-abc" onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('order-detail-error')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    (orderService.getOrderDetail as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrder);
    render(<OrderDetailView orderId="order-abc" onBack={onBack} />);
    await waitFor(() => screen.getByText('AAU-2026-0099'));
    fireEvent.click(screen.getByText(/back to my orders/i));
    expect(onBack).toHaveBeenCalled();
  });
});
