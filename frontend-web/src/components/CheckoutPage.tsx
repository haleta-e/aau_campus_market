import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { FulfillmentMethod, PaymentMethod, PlacedOrderConfirmation } from '../types/order';

interface CheckoutPageProps {
  onBackToCart: () => void;
  onOrderPlaced: (confirmation: PlacedOrderConfirmation) => void;
}

const DELIVERY_FEE = 20.0;

export function CheckoutPage({ onBackToCart, onOrderPlaced }: CheckoutPageProps) {
  const { items, subtotal, clearCart } = useCart();
  const { user, token } = useAuth();

  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('delivery');
  const [selectedCampus, setSelectedCampus] = useState<string>('4 Kilo Campus');
  const [deliveryLocation, setDeliveryLocation] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const deliveryFee = fulfillmentMethod === 'delivery' ? DELIVERY_FEE : 0.0;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setSubmitError('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (!token || !user) {
      setSubmitError('Authentication is required to place an order. Please sign in.');
      return;
    }

    if (fulfillmentMethod === 'delivery' && !deliveryLocation.trim()) {
      setSubmitError('Please specify your dormitory block or department room for delivery.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Find primary seller_id from the first item (all items in batch or single seller)
      const primarySellerId = items[0]?.product.seller_id;
      if (!primarySellerId) {
        throw new Error('Missing seller information for cart products.');
      }

      const orderPayload = {
        seller_id: primarySellerId,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      };

      // 1. Submit order atomically to backend
      const createdOrder = await orderService.placeOrder(orderPayload, token);

      // 2. Process chosen payment method
      let transactionResult;
      try {
        transactionResult = await orderService.processPayment(
          {
            order_id: createdOrder.id,
            payment_method: paymentMethod,
          },
          token
        );
      } catch (payErr: any) {
        console.warn('Payment recording note:', payErr);
      }

      // 3. Clear cart ONLY after successful order placement
      clearCart();

      // 4. Navigate to confirmation view
      onOrderPlaced({
        order: createdOrder,
        transaction: transactionResult,
        fulfillmentMethod,
        deliveryFee,
        pickupLocation: fulfillmentMethod === 'pickup' ? `${selectedCampus} Student Hub` : undefined,
        deliveryAddress: fulfillmentMethod === 'delivery' ? `${selectedCampus} - ${deliveryLocation.trim()}` : undefined,
      });
    } catch (err: any) {
      const msg = err?.message || 'Unable to complete order submission. Please try again.';
      setSubmitError(msg);
      // Notice: Cart is NOT cleared on failure, per requirement!
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-container" data-testid="checkout-page">
      <div className="checkout-header">
        <button type="button" className="back-btn" onClick={onBackToCart} disabled={isSubmitting}>
          ← Back to Shopping Cart
        </button>
        <h1 className="checkout-title">Review & Complete Order</h1>
        <p className="checkout-subtitle">
          Confirm your campus fulfillment option and supported payment method
        </p>
      </div>

      {submitError && (
        <div className="checkout-error-banner" role="alert" data-testid="checkout-error-banner">
          ⚠️ {submitError}
        </div>
      )}

      <div className="checkout-layout">
        <div className="checkout-form-panel">
          {/* Step 1: Fulfillment Options */}
          <section className="checkout-card" aria-labelledby="fulfillment-heading">
            <h2 id="fulfillment-heading" className="checkout-section-title">
              1. Fulfillment Method
            </h2>
            <div className="fulfillment-options">
              <label
                className={`option-card ${fulfillmentMethod === 'delivery' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="delivery"
                  checked={fulfillmentMethod === 'delivery'}
                  onChange={() => setFulfillmentMethod('delivery')}
                  disabled={isSubmitting}
                />
                <div className="option-info">
                  <div className="option-title-row">
                    <span className="option-name">🚚 Campus Delivery</span>
                    <span className="option-price">+20.00 ETB</span>
                  </div>
                  <p className="option-desc">
                    Delivered directly to your AAU campus dormitory or lecture block
                  </p>
                </div>
              </label>

              <label
                className={`option-card ${fulfillmentMethod === 'pickup' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="fulfillment"
                  value="pickup"
                  checked={fulfillmentMethod === 'pickup'}
                  onChange={() => setFulfillmentMethod('pickup')}
                  disabled={isSubmitting}
                />
                <div className="option-info">
                  <div className="option-title-row">
                    <span className="option-name">🏬 Campus Pickup</span>
                    <span className="option-price free">FREE (0.00 ETB)</span>
                  </div>
                  <p className="option-desc">
                    Collect directly from the seller's campus store location
                  </p>
                </div>
              </label>
            </div>

            <div className="form-group campus-select-group">
              <label htmlFor="campus-select" className="form-label">
                AAU Campus Location:
              </label>
              <select
                id="campus-select"
                className="form-input"
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="4 Kilo Campus">4 Kilo (College of Natural & Computational Sciences)</option>
                <option value="5 Kilo Campus">5 Kilo (AAiT Technology Campus)</option>
                <option value="6 Kilo Campus">6 Kilo (Main / Sidist Kilo Campus)</option>
                <option value="Sefer Selam Campus">Sefer Selam Campus</option>
                <option value="Mexico Campus">Mexico (School of Commerce)</option>
                <option value="Ledeta Campus">Ledeta Campus</option>
              </select>
            </div>

            {fulfillmentMethod === 'delivery' && (
              <div className="form-group">
                <label htmlFor="delivery-address-input" className="form-label">
                  Dormitory Block / Room / Department:
                </label>
                <input
                  id="delivery-address-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Block 54, Room 214 or Civil Dept Room 102"
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </section>

          {/* Step 2: Payment Method */}
          <section className="checkout-card" aria-labelledby="payment-heading">
            <h2 id="payment-heading" className="checkout-section-title">
              2. Payment Method
            </h2>
            <div className="payment-options">
              <label className={`option-card ${paymentMethod === 'CASH' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={() => setPaymentMethod('CASH')}
                  disabled={isSubmitting}
                />
                <div className="option-info">
                  <span className="option-name">💵 Cash / Pay on Delivery</span>
                  <p className="option-desc">Pay directly in cash when receiving the product</p>
                </div>
              </label>

              <label className={`option-card ${paymentMethod === 'TELEBIRR' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="TELEBIRR"
                  checked={paymentMethod === 'TELEBIRR'}
                  onChange={() => setPaymentMethod('TELEBIRR')}
                  disabled={isSubmitting}
                />
                <div className="option-info">
                  <span className="option-name">📱 Telebirr</span>
                  <p className="option-desc">Ethio telecom digital mobile payment</p>
                </div>
              </label>

              <label className={`option-card ${paymentMethod === 'CBE' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="CBE"
                  checked={paymentMethod === 'CBE'}
                  onChange={() => setPaymentMethod('CBE')}
                  disabled={isSubmitting}
                />
                <div className="option-info">
                  <span className="option-name">🏦 CBE Birr</span>
                  <p className="option-desc">Commercial Bank of Ethiopia mobile banking</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Order Review & Submit Column */}
        <aside className="checkout-summary-panel" aria-label="Order summary">
          <h2 className="summary-title">Order Items ({items.length})</h2>

          <div className="checkout-items-list">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="checkout-item-row">
                <div className="checkout-item-details">
                  <span className="checkout-item-name">{product.name}</span>
                  <span className="checkout-item-meta">
                    Qty: {quantity} × {parseFloat(product.price).toFixed(2)} ETB
                  </span>
                </div>
                <strong className="checkout-item-price">
                  {(parseFloat(product.price) * quantity).toFixed(2)} ETB
                </strong>
              </div>
            ))}
          </div>

          <div className="summary-divider" />

          <div className="summary-row">
            <span>Merchandise Subtotal:</span>
            <span>{subtotal.toFixed(2)} ETB</span>
          </div>

          <div className="summary-row">
            <span>Fulfillment Fee:</span>
            <span>{deliveryFee === 0 ? 'FREE' : `${deliveryFee.toFixed(2)} ETB`}</span>
          </div>

          <div className="summary-total-row">
            <span>Total to Pay:</span>
            <span className="total-value" data-testid="checkout-grand-total">
              {grandTotal.toFixed(2)} ETB
            </span>
          </div>

          <button
            type="button"
            className="btn-confirm-order"
            onClick={handlePlaceOrder}
            disabled={isSubmitting || items.length === 0}
            data-testid="btn-confirm-order"
          >
            {isSubmitting ? 'Submitting Order...' : 'Confirm & Place Order'}
          </button>

          <small className="checkout-security-note">
            🔒 By placing your order, you confirm you are an authorized AAU student or staff member.
            Your order will be transmitted directly to the campus seller.
          </small>
        </aside>
      </div>
    </div>
  );
}
