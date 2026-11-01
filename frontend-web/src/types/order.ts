export type FulfillmentMethod = 'pickup' | 'delivery';

export type PaymentMethod = 'CASH' | 'CBE' | 'TELEBIRR' | 'MOCK_PAYMENT';

export interface CreateOrderItemDTO {
  product_id: string;
  quantity: number;
}

export interface CreateOrderDTO {
  seller_id: string;
  items: CreateOrderItemDTO[];
}

export interface BackendOrder {
  id: string;
  order_number: string;
  buyer_id: string;
  seller_id: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  total_amount: string;
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  created_at: string;
  updated_at: string;
  accepted_at?: string | null;
  completed_at?: string | null;
  buyer_username?: string;
  buyer_email?: string;
  store_name?: string;
  campus_location?: string;
  items?: BackendOrderItem[];
}

export interface BackendOrderItem {
  id: string;
  order_id?: string;
  product_id: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  product_name?: string;
  product_category?: string;
  /** Nested product shape — may be present when the service joins items */
  product?: { name?: string; category?: string };
}

export interface ProcessPaymentDTO {
  order_id: string;
  payment_method: PaymentMethod;
}

export interface TransactionResult {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  amount: string;
  payment_method: PaymentMethod;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  reference: string;
  created_at: string;
}

export interface PlacedOrderConfirmation {
  order: BackendOrder;
  transaction?: TransactionResult;
  fulfillmentMethod: FulfillmentMethod;
  deliveryFee: number;
  pickupLocation?: string;
  deliveryAddress?: string;
}
