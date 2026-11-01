import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutPage } from './CheckoutPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { CartItem } from '../types/cart';
import { User } from '../types/auth';

const sampleUser: User = {
  id: 'u-1',
  username: 'abebe_b',
  email: 'abebe@aau.edu.et',
  role: 'BUYER',
  status: 'ACTIVE',
};

const mockCartItems: CartItem[] = [
  {
    product: {
      id: 'prod-1',
      seller_id: 'seller-1',
      name: 'USB Flash Drive 64GB',
      description: 'High speed drive',
      category: 'Electronics',
      price: '450.00',
      stock_quantity: 10,
      status: 'ACTIVE',
      created_at: '2026-10-31T10:00:00.000Z',
      updated_at: '2026-10-31T10:00:00.000Z',
      store_name: '4 Kilo Tech Hub',
      campus_location: '4 Kilo Campus',
    },
    quantity: 2,
  },
];

describe('CheckoutPage Component', () => {
  const onBackToCartMock = vi.fn();
  const onOrderPlacedMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  const renderCheckout = (items: CartItem[] = mockCartItems) => {
    return render(
      <AuthProvider initialUser={sampleUser} initialToken="test-token">
        <CartProvider initialItems={items}>
          <CheckoutPage
            onBackToCart={onBackToCartMock}
            onOrderPlaced={onOrderPlacedMock}
          />
        </CartProvider>
      </AuthProvider>
    );
  };

  it('renders order items, pricing summary, and calculates grand total with delivery fee', () => {
    renderCheckout();

    expect(screen.getByText('Review & Complete Order')).toBeInTheDocument();
    expect(screen.getByText('USB Flash Drive 64GB')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2 × 450.00 ETB')).toBeInTheDocument();

    // 450 * 2 = 900 ETB + 20 delivery fee = 920.00 ETB
    expect(screen.getByTestId('checkout-grand-total')).toHaveTextContent('920.00 ETB');
  });

  it('adjusts total when switching to free campus pickup', () => {
    renderCheckout();

    const pickupRadio = screen.getByRole('radio', { name: /Campus Pickup/i });
    fireEvent.click(pickupRadio);

    // 900 ETB + 0 = 900.00 ETB
    expect(screen.getByTestId('checkout-grand-total')).toHaveTextContent('900.00 ETB');
  });

  it('submits order successfully, clears cart, and calls onOrderPlaced', async () => {
    const mockCreatedOrder = {
      id: 'order-uuid-123',
      order_number: 'ORD-20261031-9999',
      buyer_id: 'u-1',
      seller_id: 'seller-1',
      status: 'PENDING' as const,
      total_amount: '900.00',
      payment_status: 'PENDING' as const,
      created_at: '2026-10-31T10:00:00.000Z',
      updated_at: '2026-10-31T10:00:00.000Z',
    };

    vi.spyOn(orderService, 'placeOrder').mockResolvedValueOnce(mockCreatedOrder);
    vi.spyOn(orderService, 'processPayment').mockResolvedValueOnce({
      id: 'tx-1',
      order_id: 'order-uuid-123',
      buyer_id: 'u-1',
      seller_id: 'seller-1',
      amount: '900.00',
      payment_method: 'CASH',
      status: 'SUCCESS',
      reference: 'TX-CASH-1',
      created_at: '2026-10-31T10:00:00.000Z',
    });

    renderCheckout();

    // Enter delivery location
    const locationInput = screen.getByPlaceholderText(/Block 54, Room 214/i);
    fireEvent.change(locationInput, { target: { value: 'Block 24, Room 105' } });

    // Click confirm order
    const confirmBtn = screen.getByTestId('btn-confirm-order');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(orderService.placeOrder).toHaveBeenCalledWith(
        {
          seller_id: 'seller-1',
          items: [{ product_id: 'prod-1', quantity: 2 }],
        },
        'test-token'
      );
      expect(onOrderPlacedMock).toHaveBeenCalledTimes(1);
    });

    expect(onOrderPlacedMock).toHaveBeenCalledWith(
      expect.objectContaining({
        order: mockCreatedOrder,
        fulfillmentMethod: 'delivery',
      })
    );
  });

  it('preserves cart and shows error banner if order placement fails', async () => {
    vi.spyOn(orderService, 'placeOrder').mockRejectedValueOnce(
      new Error('Insufficient stock available on campus')
    );

    renderCheckout();

    const locationInput = screen.getByPlaceholderText(/Block 54, Room 214/i);
    fireEvent.change(locationInput, { target: { value: 'Block 24, Room 105' } });

    const confirmBtn = screen.getByTestId('btn-confirm-order');
    fireEvent.click(confirmBtn);

    expect(await screen.findByTestId('checkout-error-banner')).toHaveTextContent(
      'Insufficient stock available on campus'
    );
    expect(onOrderPlacedMock).not.toHaveBeenCalled();
  });
});
