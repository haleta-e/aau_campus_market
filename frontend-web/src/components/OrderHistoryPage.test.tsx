import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderHistoryPage } from './OrderHistoryPage';

// Mock auth context
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ token: 'test-token', user: { id: 'u1', role: 'BUYER' } }),
}));

// Mock order service
vi.mock('../services/orderService', () => ({
  orderService: {
    getMyOrders: vi.fn(),
  },
}));

import { orderService } from '../services/orderService';

const mockOrders = [
  {
    id: 'order-1',
    order_number: 'AAU-2026-0001',
    status: 'PENDING',
    payment_status: 'PENDING',
    total_amount: '150.00',
    created_at: '2026-10-01T10:00:00.000Z',
    items: [],
  },
  {
    id: 'order-2',
    order_number: 'AAU-2026-0002',
    status: 'CONFIRMED',
    payment_status: 'SUCCESS',
    total_amount: '300.00',
    created_at: '2026-10-15T12:00:00.000Z',
    items: [],
  },
];

describe('OrderHistoryPage', () => {
  const onViewDetail = vi.fn();
  const onBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (orderService.getMyOrders as ReturnType<typeof vi.fn>).mockResolvedValue(new Promise(() => {}));
    render(<OrderHistoryPage onViewDetail={onViewDetail} onBack={onBack} />);
    expect(screen.getByTestId('orders-loading')).toBeInTheDocument();
  });

  it('renders orders after successful fetch', async () => {
    (orderService.getMyOrders as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrders);
    render(<OrderHistoryPage onViewDetail={onViewDetail} onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('orders-list')).toBeInTheDocument();
    });

    expect(screen.getByText('AAU-2026-0001')).toBeInTheDocument();
    expect(screen.getByText('AAU-2026-0002')).toBeInTheDocument();
  });

  it('shows empty state when no orders exist', async () => {
    (orderService.getMyOrders as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    render(<OrderHistoryPage onViewDetail={onViewDetail} onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('orders-empty')).toBeInTheDocument();
    });
  });

  it('shows error state with retry button on failure', async () => {
    (orderService.getMyOrders as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Network error')
    );
    render(<OrderHistoryPage onViewDetail={onViewDetail} onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('orders-error')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onViewDetail with the correct order id when View Details is clicked', async () => {
    (orderService.getMyOrders as ReturnType<typeof vi.fn>).mockResolvedValue(mockOrders);
    render(<OrderHistoryPage onViewDetail={onViewDetail} onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByTestId('orders-list')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('btn-view-detail-order-1'));
    expect(onViewDetail).toHaveBeenCalledWith('order-1');
  });

  it('calls onBack when the back button is clicked', async () => {
    (orderService.getMyOrders as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    render(<OrderHistoryPage onViewDetail={onViewDetail} onBack={onBack} />);
    await waitFor(() => screen.getByTestId('orders-empty'));
    fireEvent.click(screen.getByText(/back to catalogue/i));
    expect(onBack).toHaveBeenCalled();
  });
});
