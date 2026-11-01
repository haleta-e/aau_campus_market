import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { BackendOrder } from '../types/order';

interface OrderDetailViewProps {
  orderId: string;
  onBack: () => void;
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'Awaiting Confirmation',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Being Prepared',
    READY: 'Ready for Collection',
    ACCEPTED: 'Received',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  return map[status] ?? status;
}

function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: 'badge badge-pending',
    CONFIRMED: 'badge badge-confirmed',
    PREPARING: 'badge badge-preparing',
    READY: 'badge badge-ready',
    ACCEPTED: 'badge badge-accepted',
    COMPLETED: 'badge badge-completed',
    CANCELLED: 'badge badge-cancelled',
  };
  return map[status] ?? 'badge badge-pending';
}

export function OrderDetailView({ orderId, onBack }: OrderDetailViewProps) {
  const { token } = useAuth();

  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = useCallback(async () => {
    if (!token) {
      setError('Authentication required.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await orderService.getOrderDetail(orderId, token);
      setOrder(result);
    } catch (err: any) {
      setError(err?.message || 'Unable to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  return (
    <div className="order-detail-container" data-testid="order-detail-view">
      <div className="order-detail-header">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Back to My Orders
        </button>
        <h1 className="order-detail-title">Order Details</h1>
      </div>

      {loading ? (
        <p aria-live="polite" data-testid="order-detail-loading">Loading order details…</p>
      ) : error ? (
        <div className="error-container" role="alert" data-testid="order-detail-error">
          <p>{error}</p>
          <button type="button" className="btn-retry" onClick={loadOrder}>
            Retry
          </button>
        </div>
      ) : order ? (
        <>
          {/* Order Summary Card */}
          <div className="order-detail-card">
            <h2 className="order-detail-section-title">Order Summary</h2>
            <div className="order-detail-meta-grid">
              <div className="order-detail-meta-item">
                <span className="order-detail-meta-label">Order Number</span>
                <span className="order-detail-meta-value" style={{ fontFamily: 'monospace' }}>
                  {order.order_number}
                </span>
              </div>
              <div className="order-detail-meta-item">
                <span className="order-detail-meta-label">Status</span>
                <span className={statusBadgeClass(order.status)} data-testid="order-status-badge">
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="order-detail-meta-item">
                <span className="order-detail-meta-label">Payment Status</span>
                <span className="order-detail-meta-value">{order.payment_status || '—'}</span>
              </div>
              <div className="order-detail-meta-item">
                <span className="order-detail-meta-label">Date Placed</span>
                <span className="order-detail-meta-value">
                  {new Date(order.created_at).toLocaleString('en-ET')}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Card */}
          {order.items && order.items.length > 0 && (
            <div className="order-detail-card">
              <h2 className="order-detail-section-title">Items Ordered</h2>
              <table className="order-items-table" data-testid="order-items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => {
                    const unitPrice = parseFloat(item.unit_price);
                    const subtotal = unitPrice * item.quantity;
                    return (
                      <tr key={item.id}>
                        <td>{item.product_name ?? item.product_id}</td>
                        <td>{item.product_category ?? '—'}</td>
                        <td>{item.quantity}</td>
                        <td>{unitPrice.toFixed(2)} ETB</td>
                        <td>{subtotal.toFixed(2)} ETB</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="order-detail-total-row">
                <span>Order Total:</span>
                <span className="order-detail-total-value" data-testid="order-detail-total">
                  {parseFloat(order.total_amount).toFixed(2)} ETB
                </span>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
