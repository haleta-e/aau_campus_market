import { PlacedOrderConfirmation } from '../types/order';

interface OrderConfirmationProps {
  confirmation: PlacedOrderConfirmation;
  onContinueShopping: () => void;
  onViewOrders: () => void;
}

export function OrderConfirmation({
  confirmation,
  onContinueShopping,
  onViewOrders,
}: OrderConfirmationProps) {
  const { order, fulfillmentMethod, deliveryAddress, pickupLocation } = confirmation;

  return (
    <div className="order-confirmation-container" data-testid="order-confirmation-view">
      <div className="confirmation-card">
        <div className="confirmation-success-icon" aria-hidden="true">
          ✅
        </div>
        <h1 className="confirmation-title">Order Placed Successfully!</h1>
        <p className="confirmation-subtitle">
          Thank you for shopping at AAU Campus Market. Your order has been submitted to the seller.
        </p>

        <div className="order-receipt-box">
          <div className="receipt-row highlight">
            <span>Order Number:</span>
            <strong className="order-number" data-testid="confirmed-order-number">
              {order.order_number}
            </strong>
          </div>
          <div className="receipt-row">
            <span>Order Status:</span>
            <span className="order-status-badge status-pending">{order.status}</span>
          </div>
          <div className="receipt-row">
            <span>Payment Status:</span>
            <span className="order-status-badge status-payment">{order.payment_status}</span>
          </div>
          <div className="receipt-row">
            <span>Fulfillment:</span>
            <span>
              {fulfillmentMethod === 'delivery'
                ? `🚚 Campus Delivery (${deliveryAddress || 'Campus Dormitory'})`
                : `🏬 Campus Pickup (${pickupLocation || 'Campus Store'})`}
            </span>
          </div>
          <div className="receipt-row">
            <span>Total Amount:</span>
            <strong className="receipt-total">{parseFloat(order.total_amount).toFixed(2)} ETB</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <button type="button" className="btn-view-orders" onClick={onViewOrders}>
            📋 View My Orders
          </button>
          <button type="button" className="btn-continue-catalog" onClick={onContinueShopping}>
            ← Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
