export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  stock_quantity: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
  store_name?: string | null;
  campus_location?: string | null;
  seller_phone?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  status: 'success';
  data: Product[];
  pagination: PaginationMeta;
}

export interface ProductDetailResponse {
  status: 'success';
  data: Product;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  seller_id?: string;
}

export interface ApiErrorResponse {
  status: 'error';
  code?: string;
  message?: string;
  errors?: Record<string, unknown>;
}
