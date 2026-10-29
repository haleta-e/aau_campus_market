import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { productService } from './productService';
import { API_BASE_URL, ApiError } from '../config/api';

describe('productService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches products successfully with default parameters', async () => {
    const mockResponse = {
      status: 'success',
      data: [
        {
          id: 'prod-1',
          seller_id: 'seller-1',
          name: 'Flash Drive',
          description: '64GB Drive',
          category: 'Electronics',
          price: '450.00',
          stock_quantity: 15,
          status: 'ACTIVE',
          created_at: '2026-10-29T10:00:00.000Z',
          updated_at: '2026-10-29T10:00:00.000Z',
          store_name: '4 Kilo Tech Hub',
          campus_location: '4 Kilo Campus',
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await productService.getProducts();

    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE_URL}/products`,
      expect.objectContaining({ method: 'GET' })
    );
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Flash Drive');
    expect(result.pagination.total).toBe(1);
  });

  it('correctly serializes query params for search, category, and pagination', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'success',
        data: [],
        pagination: { page: 2, limit: 10, total: 0, totalPages: 0 },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await productService.getProducts({
      page: 2,
      limit: 10,
      search: 'Notebook',
      category: 'Stationery',
    });

    const expectedUrl = `${API_BASE_URL}/products?page=2&limit=10&category=Stationery&search=Notebook`;
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
  });

  it('throws ApiError when backend returns a validation error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(productService.getProducts({ seller_id: 'invalid-uuid' })).rejects.toThrow(
      ApiError
    );
  });

  it('throws network error ApiError when fetch fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(productService.getProducts()).rejects.toThrow(
      /Unable to connect to the marketplace backend server/
    );
  });

  it('fetches a single product by ID', async () => {
    const mockDetail = {
      status: 'success',
      data: {
        id: '123',
        seller_id: 'seller-1',
        name: 'Scientific Calculator fx-991EX',
        description: 'Approved calculator',
        category: 'Electronics',
        price: '1250.00',
        stock_quantity: 8,
        status: 'ACTIVE',
        created_at: '2026-10-29T10:00:00.000Z',
        updated_at: '2026-10-29T10:00:00.000Z',
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockDetail,
    });
    vi.stubGlobal('fetch', fetchMock);

    const product = await productService.getProductById('123');
    expect(product.id).toBe('123');
    expect(product.name).toBe('Scientific Calculator fx-991EX');
  });
});
