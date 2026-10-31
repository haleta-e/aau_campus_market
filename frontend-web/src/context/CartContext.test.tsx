import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { CartProvider, useCart, CART_STORAGE_KEY, loadCartFromStorage } from './CartContext';
import { Product } from '../types/product';

const sampleProductA: Product = {
  id: 'prod-a',
  seller_id: 'seller-1',
  name: 'USB Flash Drive 64GB',
  description: 'Fast drive',
  category: 'Electronics',
  price: '450.00',
  stock_quantity: 5,
  status: 'ACTIVE',
  created_at: '2026-10-29T10:00:00.000Z',
  updated_at: '2026-10-29T10:00:00.000Z',
  store_name: '4 Kilo Tech Hub',
  campus_location: '4 Kilo Campus',
};

const sampleProductB: Product = {
  id: 'prod-b',
  seller_id: 'seller-2',
  name: 'Notebook 200 Pages',
  description: 'Hardcover',
  category: 'Stationery',
  price: '120.00',
  stock_quantity: 10,
  status: 'ACTIVE',
  created_at: '2026-10-29T10:00:00.000Z',
  updated_at: '2026-10-29T10:00:00.000Z',
  store_name: '5 Kilo Books',
  campus_location: '5 Kilo Campus',
};

const outOfStockProduct: Product = {
  id: 'prod-c',
  seller_id: 'seller-1',
  name: 'Sold Out Item',
  description: 'Out of stock',
  category: 'Electronics',
  price: '300.00',
  stock_quantity: 0,
  status: 'ACTIVE',
  created_at: '2026-10-29T10:00:00.000Z',
  updated_at: '2026-10-29T10:00:00.000Z',
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with an empty cart when localStorage has no data', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.formattedSubtotal).toBe('0.00 ETB');
  });

  it('adds an item to the cart and persists to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      const res = result.current.addToCart(sampleProductA, 2);
      expect(res.success).toBe(true);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('prod-a');
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.subtotal).toBe(900); // 450 * 2
    expect(result.current.formattedSubtotal).toBe('900.00 ETB');

    // Verify localStorage
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(saved).toHaveLength(1);
    expect(saved[0].quantity).toBe(2);
  });

  it('combines quantities when adding an existing product to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProductA, 2);
    });
    act(() => {
      const res = result.current.addToCart(sampleProductA, 2);
      expect(res.success).toBe(true);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(4);
    expect(result.current.subtotal).toBe(1800);
  });

  it('rejects adding quantity that exceeds available stock limit', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProductA, 3);
    });

    // sampleProductA has stock_quantity: 5. 3 already in cart + 3 = 6 (exceeds 5)
    act(() => {
      const res = result.current.addToCart(sampleProductA, 3);
      expect(res.success).toBe(false);
      expect(res.message).toMatch(/Stock limit is 5/);
    });

    expect(result.current.items[0].quantity).toBe(3);
  });

  it('rejects adding an out-of-stock product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      const res = result.current.addToCart(outOfStockProduct, 1);
      expect(res.success).toBe(false);
      expect(res.message).toMatch(/out of stock/i);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('rejects invalid or non-positive quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      const res = result.current.addToCart(sampleProductA, 0);
      expect(res.success).toBe(false);
    });

    act(() => {
      const res = result.current.addToCart(sampleProductA, -2);
      expect(res.success).toBe(false);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('updates quantity of an existing item and recalculates subtotals', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProductB, 2);
    });

    act(() => {
      const res = result.current.updateQuantity('prod-b', 5);
      expect(res.success).toBe(true);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.subtotal).toBe(600); // 120 * 5
  });

  it('caps quantity at maximum available stock when updated with higher number', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProductA, 2);
    });

    act(() => {
      const res = result.current.updateQuantity('prod-a', 20); // stock is 5
      expect(res.success).toBe(true);
      expect(res.message).toMatch(/maximum available stock \(5\)/);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it('removes item from cart when quantity is set to 0 or less', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProductA, 2);
      result.current.updateQuantity('prod-a', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('removes item using removeFromCart and clears cart with clearCart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(sampleProductA, 1);
      result.current.addToCart(sampleProductB, 2);
    });
    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeFromCart('prod-a');
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('prod-b');

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
  });

  it('safely handles corrupted or malformed localStorage data', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'invalid-json{{{');
    const items = loadCartFromStorage();
    expect(items).toEqual([]);

    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify([{ invalid: 'structure' }, null, 'test', { product: { id: 123 }, quantity: 'bad' }])
    );
    const validItems = loadCartFromStorage();
    expect(validItems).toEqual([]);
  });
});
