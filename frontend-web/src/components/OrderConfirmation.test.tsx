import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderConfirmation } from './OrderConfirmation';
import { PlacedOrderConfirmation } from '../types/order';

const sampleConfirmation: PlacedOrderConfirmation = {
  order: {
    id: 'ord-uuid-555',
    order_number: 'ORD-20261031-7777',
    buyer_id: 'u-1',
    seller_id: 's-1',
    status: 'PENDING',
    total_amount: '920.00',
    payment_status: 'PENDING',
    created_at: '2026-10-31T10:00:00.000Z',
    updated_at: '2026-10-31T10:00:00.000Z',
  },
  fulfillmentMethod: 'delivery',
  deliveryFee: 20,
  deliveryAddress: '4 Kilo Campus - Block 24, Room 105',
};

describe('OrderConfirmation Component', () => {
  it('renders order confirmation details accurately', () => {
    const onContinueShoppingMock = vi.fn();
    const onViewOrdersMock = vi.fn();

    render(
      <OrderConfirmation
        confirmation={sampleConfirmation}
        onContinueShopping={onContinueShoppingMock}
        onViewOrders={onViewOrdersMock}
      />
    );

    expect(screen.getByText('Order Placed Successfully!')).toBeInTheDocument();
    expect(screen.getByTestId('confirmed-order-number')).toHaveTextContent('ORD-20261031-7777');
    expect(screen.getByText('920.00 ETB')).toBeInTheDocument();
    expect(screen.getByText(/Block 24, Room 105/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Continue Shopping/i }));
    expect(onContinueShoppingMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /View My Orders/i }));
    expect(onViewOrdersMock).toHaveBeenCalledTimes(1);
  });
});
