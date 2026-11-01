import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { BackendOrder } from '../types/order';

/** Map backend order status codes to human-readable labels */
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

/** Derive a CSS badge class from the order status */
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

interface OrderHistoryPageProps {
  onViewDetail: (orderId: string) => void;
  onBack: () => void;
}

export function OrderHistoryPage({ onViewDetail, onBack }: OrderHistoryPageProps) {
  const { token } = useAuth();

  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!token) {
      setError('You must be signed in to view your orders.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await orderService.getMyOrders(token);
      // Sort most recent first
      const sorted = [...result].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sorted);
    } catch (err: any) {
      setError(err?.message || 'Unable to load your orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="order-history-container" data-testid="order-history-page">
      <div className="order-history-header">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Back to Catalogue
        </button>
        <h1 className="order-history-title">My Orders</h1>
      </div>

      {loading ? (
        <p aria-live="polite" data-testid="orders-loading">Loading your orders…</p>
      ) : error ? (
        <div className="error-container" role="alert" data-testid="orders-error">
          <p>{error}</p>
          <button type="button" className="btn-retry" onClick={loadOrders}>
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state" data-testid="orders-empty">
          <p>You have not placed any orders yet.</p>
          <button type="button" className="btn-primary" onClick={onBack}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="order-history-list" data-testid="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-history-card" data-testid="order-history-card">
              <div className="order-history-card-info">
                <span className="order-history-number">{order.order_number}</span>
                <div className="order-history-meta">
                  <span>{new Date(order.created_at).toLocaleDateString('en-ET')}</span>
                  <span>·</span>
                  <span className={statusBadgeClass(order.status)}>
                    {statusLabel(order.status)}
                  </span>
                  {order.payment_status && (
                    <>
                      <span>·</span>
                      <span>Payment: {order.payment_status}</span>
                    </>
                  )}
                </div>
                <span className="order-history-total">
                  {parseFloat(order.total_amount).toFixed(2)} ETB
                </span>
              </div>

              <div className="order-history-card-actions">
                <button
                  type="button"
                  className="btn-view-order-detail"
                  onClick={() => onViewDetail(order.id)}
                  data-testid={`btn-view-detail-${order.id}`}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
