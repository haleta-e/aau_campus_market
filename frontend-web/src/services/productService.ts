import { API_BASE_URL, ApiError } from '../config/api';
import {
  Product,
  ProductListParams,
  ProductListResponse,
  ProductDetailResponse,
  ApiErrorResponse,
} from '../types/product';

/**
 * Service to interact with AAU Campus Market Product API endpoints.
 */
export const productService = {
  /**
   * Fetch active marketplace products with optional filtering and pagination.
   */
  async getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
    const query = new URLSearchParams();

    if (params.page !== undefined && params.page > 0) {
      query.append('page', String(params.page));
    }
    if (params.limit !== undefined && params.limit > 0) {
      query.append('limit', String(params.limit));
    }
    if (params.category && params.category.trim() !== '') {
      query.append('category', params.category.trim());
    }
    if (params.search && params.search.trim() !== '') {
      query.append('search', params.search.trim());
    }
    if (params.seller_id && params.seller_id.trim() !== '') {
      query.append('seller_id', params.seller_id.trim());
    }

    const queryString = query.toString();
    const endpoint = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
          errorData = await response.json();
        } catch {
          // Non-JSON response (e.g. 502/504 gateway error)
        }

        const message =
          errorData?.message ||
          `Failed to retrieve products (Server returned status ${response.status})`;

        throw new ApiError(message, response.status, errorData?.code, errorData?.errors);
      }

      const data: ProductListResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Unable to connect to the marketplace backend server. Please verify your connection or ensure the API server is active.',
        0,
        'NETWORK_ERROR',
        error
      );
    }
  },

  /**
   * Fetch a single product by ID.
   */
  async getProductById(id: string): Promise<Product> {
    const endpoint = `${API_BASE_URL}/products/${encodeURIComponent(id)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        let errorData: ApiErrorResponse | null = null;
        try {
          errorData = await response.json();
        } catch {
          // Ignore json parse error
        }
        throw new ApiError(
          errorData?.message || `Product not found (Status ${response.status})`,
          response.status,
          errorData?.code
        );
      }

      const result: ProductDetailResponse = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        'Unable to connect to the marketplace backend server.',
        0,
        'NETWORK_ERROR',
        error
      );
    }
  },
};
