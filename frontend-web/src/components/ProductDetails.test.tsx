import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductDetails } from './ProductDetails';
import { CartProvider } from '../context/CartContext';
import { Product } from '../types/product';
import { productService } from '../services/productService';

const sampleProduct: Product = {
  id: 'prod-101',
  seller_id: 'seller-1',
  name: 'Scientific Calculator fx-991EX',
  description: 'Approved for AAU engineering exams.',
  category: 'Electronics',
  price: '1250.00',
  stock_quantity: 4,
  status: 'ACTIVE',
  created_at: '2026-10-29T10:00:00.000Z',
  updated_at: '2026-10-29T10:00:00.000Z',
  store_name: '4 Kilo Tech Hub',
  campus_location: '4 Kilo Campus',
  seller_phone: '+251911223344',
};

const outOfStockProduct: Product = {
  id: 'prod-102',
  seller_id: 'seller-1',
  name: 'Out of Stock Textbook',
  description: 'No copies remaining',
  category: 'Books',
  price: '300.00',
  stock_quantity: 0,
  status: 'ACTIVE',
  created_at: '2026-10-29T10:00:00.000Z',
  updated_at: '2026-10-29T10:00:00.000Z',
};

describe('ProductDetails Component', () => {
  const onBackMock = vi.fn();
  const onViewCartMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders complete product information from props/API', () => {
    render(
      <CartProvider>
        <ProductDetails
          productId="prod-101"
          initialProduct={sampleProduct}
          onBack={onBackMock}
          onViewCart={onViewCartMock}
        />
      </CartProvider>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Scientific Calculator fx-991EX');
    expect(screen.getByText('1,250.00 ETB')).toBeInTheDocument();
    expect(screen.getByText('4 Kilo Tech Hub')).toBeInTheDocument();
    expect(screen.getByText('4 Kilo Campus')).toBeInTheDocument();
    expect(screen.getByText('+251911223344')).toBeInTheDocument();
    expect(screen.getByText('Approved for AAU engineering exams.')).toBeInTheDocument();
    expect(screen.getByText(/Low Stock — Only 4 left/)).toBeInTheDocument();
  });

  it('navigates back to catalogue when back button is clicked', () => {
    render(
      <CartProvider>
        <ProductDetails
          productId="prod-101"
          initialProduct={sampleProduct}
          onBack={onBackMock}
          onViewCart={onViewCartMock}
        />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /Back to Catalogue/i }));
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it('controls and validates quantity selection against stock limits', () => {
    render(
      <CartProvider>
        <ProductDetails
          productId="prod-101"
          initialProduct={sampleProduct}
          onBack={onBackMock}
          onViewCart={onViewCartMock}
        />
      </CartProvider>
    );

    const input = screen.getByLabelText(/Product quantity/i) as HTMLInputElement;
    const plusBtn = screen.getByRole('button', { name: /Increase quantity/i });
    const minusBtn = screen.getByRole('button', { name: /Decrease quantity/i });

    expect(input.value).toBe('1');

    // Increment
    fireEvent.click(plusBtn);
    expect(input.value).toBe('2');

    // Decrement
    fireEvent.click(minusBtn);
    expect(input.value).toBe('1');

    // Decrement when at 1 should not reduce
    fireEvent.click(minusBtn);
    expect(input.value).toBe('1');

    // Increment up to stock limit of 4
    fireEvent.click(plusBtn); // 2
    fireEvent.click(plusBtn); // 3
    fireEvent.click(plusBtn); // 4
    expect(input.value).toBe('4');
    expect(plusBtn).toBeDisabled();

    // Type a quantity exceeding stock
    fireEvent.change(input, { target: { value: '10' } });
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot exceed available stock/i);
    expect(screen.getByRole('button', { name: /Add to Cart/i })).toBeDisabled();
  });

  it('successfully adds quantity to cart and displays feedback banner', () => {
    render(
      <CartProvider>
        <ProductDetails
          productId="prod-101"
          initialProduct={sampleProduct}
          onBack={onBackMock}
          onViewCart={onViewCartMock}
        />
      </CartProvider>
    );

    const plusBtn = screen.getByRole('button', { name: /Increase quantity/i });
    fireEvent.click(plusBtn); // quantity = 2

    const addBtn = screen.getByRole('button', { name: /Add to Cart/i });
    fireEvent.click(addBtn);

    expect(screen.getByRole('status')).toHaveTextContent(/Added 2 unit\(s\) of "Scientific Calculator fx-991EX" to cart/i);

    // Clicking "View Cart" triggers onViewCart callback
    fireEvent.click(screen.getByRole('button', { name: /View Cart/i }));
    expect(onViewCartMock).toHaveBeenCalledTimes(1);
  });

  it('renders out-of-stock state and disables adding to cart', () => {
    render(
      <CartProvider>
        <ProductDetails
          productId="prod-102"
          initialProduct={outOfStockProduct}
          onBack={onBackMock}
          onViewCart={onViewCartMock}
        />
      </CartProvider>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText(/This item is currently out of stock and cannot be ordered/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Add to Cart/i })).not.toBeInTheDocument();
  });

  it('fetches product by ID when initialProduct is not provided', async () => {
    vi.spyOn(productService, 'getProductById').mockResolvedValueOnce(sampleProduct);

    render(
      <CartProvider>
        <ProductDetails
          productId="prod-101"
          onBack={onBackMock}
          onViewCart={onViewCartMock}
        />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Scientific Calculator fx-991EX')).toBeInTheDocument();
    });
  });
});
