import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import App from './App';
import { productService } from './services/productService';
import { ApiError } from './config/api';
import { Product } from './types/product';

const mockProducts: Product[] = [
  {
    id: 'prod-1',
    seller_id: 'seller-1',
    name: 'USB Flash Drive 64GB High Speed',
    description: 'Durable USB 3.0 flash drive',
    category: 'Electronics',
    price: '450.00',
    stock_quantity: 25,
    status: 'ACTIVE',
    created_at: '2026-10-29T10:00:00.000Z',
    updated_at: '2026-10-29T10:00:00.000Z',
    store_name: '4 Kilo Tech Hub',
    campus_location: '4 Kilo Campus',
  },
  {
    id: 'prod-2',
    seller_id: 'seller-2',
    name: 'A4 Exercise Notebook 200 Pages',
    description: 'Hardcover grid notebook',
    category: 'Stationery',
    price: '120.00',
    stock_quantity: 4,
    status: 'ACTIVE',
    created_at: '2026-10-29T10:00:00.000Z',
    updated_at: '2026-10-29T10:00:00.000Z',
    store_name: '5 Kilo Books',
    campus_location: '5 Kilo Campus',
  },
  {
    id: 'prod-3',
    seller_id: 'seller-1',
    name: 'Scientific Calculator fx-991EX',
    description: 'Approved for AAU exams',
    category: 'Electronics',
    price: '1250.00',
    stock_quantity: 0,
    status: 'ACTIVE',
    created_at: '2026-10-29T10:00:00.000Z',
    updated_at: '2026-10-29T10:00:00.000Z',
    store_name: '4 Kilo Tech Hub',
    campus_location: '4 Kilo Campus',
  },
];

describe('App Component - Product Catalogue & Interaction', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially then renders products', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValueOnce({
      status: 'success',
      data: mockProducts,
      pagination: { page: 1, limit: 20, total: 3, totalPages: 1 },
    });

    render(<App />);

    // Initially shows loading skeletons
    expect(screen.getAllByTestId('loading-skeleton').length).toBeGreaterThan(0);

    // After loading completes
    await waitFor(() => {
      expect(screen.getByText('USB Flash Drive 64GB High Speed')).toBeInTheDocument();
      expect(screen.getByText('A4 Exercise Notebook 200 Pages')).toBeInTheDocument();
      expect(screen.getByText('Scientific Calculator fx-991EX')).toBeInTheDocument();
    });

    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 3 products');
  });

  it('filters products by in-stock only', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue({
      status: 'success',
      data: mockProducts,
      pagination: { page: 1, limit: 20, total: 3, totalPages: 1 },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Scientific Calculator fx-991EX')).toBeInTheDocument();
    });

    // Check "In Stock Only" checkbox
    const inStockCheckbox = screen.getByLabelText('In Stock Only');
    fireEvent.click(inStockCheckbox);

    // The out-of-stock calculator should be hidden
    expect(screen.queryByText('Scientific Calculator fx-991EX')).not.toBeInTheDocument();
    expect(screen.getByText('USB Flash Drive 64GB High Speed')).toBeInTheDocument();
    expect(screen.getByText('A4 Exercise Notebook 200 Pages')).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 2 products');
  });

  it('filters products by campus location', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValue({
      status: 'success',
      data: mockProducts,
      pagination: { page: 1, limit: 20, total: 3, totalPages: 1 },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('A4 Exercise Notebook 200 Pages')).toBeInTheDocument();
    });

    const campusSelect = screen.getByLabelText('Campus');
    fireEvent.change(campusSelect, { target: { value: '5 Kilo Campus' } });

    // Only 5 Kilo items should remain
    expect(screen.getByText('A4 Exercise Notebook 200 Pages')).toBeInTheDocument();
    expect(screen.queryByText('USB Flash Drive 64GB High Speed')).not.toBeInTheDocument();
  });

  it('handles backend connection failure and allows retry', async () => {
    const getProductsMock = vi
      .spyOn(productService, 'getProducts')
      .mockRejectedValueOnce(
        new ApiError(
          'Unable to connect to the marketplace backend server.',
          0,
          'NETWORK_ERROR'
        )
      )
      .mockResolvedValueOnce({
        status: 'success',
        data: mockProducts,
        pagination: { page: 1, limit: 20, total: 3, totalPages: 1 },
      });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Backend Connection Issue')).toBeInTheDocument();
    });

    // Click retry button
    const retryBtn = screen.getByRole('button', { name: /Retry Connection/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('USB Flash Drive 64GB High Speed')).toBeInTheDocument();
    });

    expect(getProductsMock).toHaveBeenCalledTimes(2);
  });

  it('displays empty state when no products are found', async () => {
    vi.spyOn(productService, 'getProducts').mockResolvedValueOnce({
      status: 'success',
      data: [],
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
      expect(screen.getByText('Catalogue Is Currently Empty')).toBeInTheDocument();
    });
  });
});
