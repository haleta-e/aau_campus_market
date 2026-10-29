import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { Product } from '../types/product';

const sampleProduct: Product = {
  id: 'test-1',
  seller_id: 'seller-1',
  name: 'Scientific Calculator fx-991EX',
  description: 'Approved for AAU engineering exams.',
  category: 'Electronics',
  price: '1250.00',
  stock_quantity: 10,
  status: 'ACTIVE',
  created_at: '2026-10-29T10:00:00.000Z',
  updated_at: '2026-10-29T10:00:00.000Z',
  store_name: '4 Kilo Tech Hub',
  campus_location: '4 Kilo Campus',
};

describe('ProductCard', () => {
  it('renders product details correctly', () => {
    render(<ProductCard product={sampleProduct} />);

    expect(screen.getByText('Scientific Calculator fx-991EX')).toBeInTheDocument();
    expect(screen.getByText('Approved for AAU engineering exams.')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('1,250.00 ETB')).toBeInTheDocument();
    expect(screen.getByText(/4 Kilo Tech Hub/)).toBeInTheDocument();
    expect(screen.getByText(/4 Kilo Campus/)).toBeInTheDocument();
    expect(screen.getByText('In Stock (10)')).toBeInTheDocument();
  });

  it('renders low stock badge when quantity is between 1 and 5', () => {
    const lowStockProduct: Product = {
      ...sampleProduct,
      stock_quantity: 3,
    };

    render(<ProductCard product={lowStockProduct} />);
    expect(screen.getByText('Only 3 left')).toBeInTheDocument();
  });

  it('renders out of stock badge when quantity is 0', () => {
    const outOfStockProduct: Product = {
      ...sampleProduct,
      stock_quantity: 0,
    };

    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('gracefully handles missing optional description, store name, and campus', () => {
    const minimalProduct: Product = {
      id: 'test-2',
      seller_id: 'seller-1',
      name: 'Notebook',
      description: null,
      category: 'Stationery',
      price: '50.00',
      stock_quantity: 20,
      status: 'ACTIVE',
      created_at: '2026-10-29T10:00:00.000Z',
      updated_at: '2026-10-29T10:00:00.000Z',
    };

    render(<ProductCard product={minimalProduct} />);
    expect(screen.getByText('Notebook')).toBeInTheDocument();
    expect(screen.getByText('50.00 ETB')).toBeInTheDocument();
    expect(screen.queryByText(/4 Kilo/)).not.toBeInTheDocument();
  });
});
