import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartPage } from './CartPage';
import { CartProvider } from '../context/CartContext';
import { CartItem } from '../types/cart';

const mockItems: CartItem[] = [
  {
    product: {
      id: 'prod-1',
      seller_id: 'seller-1',
      name: 'USB Flash Drive 64GB',
      description: 'High speed drive',
      category: 'Electronics',
      price: '450.00',
      stock_quantity: 5,
      status: 'ACTIVE',
      created_at: '2026-10-29T10:00:00.000Z',
      updated_at: '2026-10-29T10:00:00.000Z',
      store_name: '4 Kilo Tech Hub',
      campus_location: '4 Kilo Campus',
    },
    quantity: 2,
  },
  {
    product: {
      id: 'prod-2',
      seller_id: 'seller-2',
      name: 'A4 Exercise Notebook',
      description: '200 pages grid',
      category: 'Stationery',
      price: '120.00',
      stock_quantity: 10,
      status: 'ACTIVE',
      created_at: '2026-10-29T10:00:00.000Z',
      updated_at: '2026-10-29T10:00:00.000Z',
      store_name: '5 Kilo Books',
      campus_location: '5 Kilo Campus',
    },
    quantity: 3,
  },
];

describe('CartPage Component', () => {
  const onContinueShoppingMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders empty cart view when cart has no items', () => {
    render(
      <CartProvider initialItems={[]}>
        <CartPage onContinueShopping={onContinueShoppingMock} />
      </CartProvider>
    );

    expect(screen.getByText('Your Shopping Cart is Empty')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Explore Products/i }));
    expect(onContinueShoppingMock).toHaveBeenCalledTimes(1);
  });

  it('renders cart items, quantities, and correct subtotals', () => {
    render(
      <CartProvider initialItems={mockItems}>
        <CartPage onContinueShopping={onContinueShoppingMock} />
      </CartProvider>
    );

    // Items rendered
    expect(screen.getByText('USB Flash Drive 64GB')).toBeInTheDocument();
    expect(screen.getByText('A4 Exercise Notebook')).toBeInTheDocument();

    // Check subtotals:
    // USB: 450 * 2 = 900.00 ETB
    // Notebook: 120 * 3 = 360.00 ETB
    // Total merchandise = 1,260.00 ETB (appears in merchandise subtotal and estimated total)
    expect(screen.getByText('900.00 ETB')).toBeInTheDocument();
    expect(screen.getByText('360.00 ETB')).toBeInTheDocument();
    expect(screen.getAllByText('1,260.00 ETB')).toHaveLength(2);
    expect(screen.getByText('Total Items:')).toBeInTheDocument();
  });

  it('updates item quantity and recalculates totals', () => {
    render(
      <CartProvider initialItems={mockItems}>
        <CartPage onContinueShopping={onContinueShoppingMock} />
      </CartProvider>
    );

    const increaseBtn = screen.getByRole('button', {
      name: /Increase quantity for USB Flash Drive 64GB/i,
    });
    fireEvent.click(increaseBtn); // USB from 2 to 3

    // New total: 450 * 3 + 360 = 1,350 + 360 = 1,710.00 ETB
    expect(screen.getByText('1,350.00 ETB')).toBeInTheDocument();
    expect(screen.getAllByText('1,710.00 ETB')).toHaveLength(2);
  });

  it('removes an item from the cart', () => {
    render(
      <CartProvider initialItems={mockItems}>
        <CartPage onContinueShopping={onContinueShoppingMock} />
      </CartProvider>
    );

    const removeBtn = screen.getByRole('button', {
      name: /Remove USB Flash Drive 64GB from cart/i,
    });
    fireEvent.click(removeBtn);

    expect(screen.queryByText('USB Flash Drive 64GB')).not.toBeInTheDocument();
    expect(screen.getByText('A4 Exercise Notebook')).toBeInTheDocument();
    // 360.00 ETB appears in item subtotal, merchandise subtotal, and estimated total
    expect(screen.getAllByText('360.00 ETB')).toHaveLength(3);
  });

  it('clears entire cart when Clear Cart is clicked', () => {
    render(
      <CartProvider initialItems={mockItems}>
        <CartPage onContinueShopping={onContinueShoppingMock} />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Clear all items from cart/i }));

    expect(screen.getByText('Your Shopping Cart is Empty')).toBeInTheDocument();
  });
});
