import { useCart } from '../context/CartContext';

interface CartPageProps {
  onContinueShopping: () => void;
  onProceedToCheckout?: () => void;
}

export function CartPage({ onContinueShopping, onProceedToCheckout }: CartPageProps) {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    formattedSubtotal,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page-container" data-testid="cart-empty-view">
        <div className="empty-state">
          <div className="empty-icon" aria-hidden="true">
            🛒
          </div>
          <h2 className="empty-title">Your Shopping Cart is Empty</h2>
          <p className="empty-description">
            You have not added any campus products to your cart yet. Browse our marketplace to find
            lecture notes, stationery, electronics, and everyday campus essentials.
          </p>
          <button
            type="button"
            className="clear-filters-btn"
            onClick={onContinueShopping}
          >
            ← Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container" data-testid="cart-page-view">
      <div className="cart-header-row">
        <div>
          <h1 className="cart-page-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            Review your selected products ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </p>
        </div>
        <button
          type="button"
          className="cart-clear-btn"
          onClick={clearCart}
          aria-label="Clear all items from cart"
        >
          🗑️ Clear Cart
        </button>
      </div>

      <div className="cart-content-layout">
        <section className="cart-items-panel" aria-label="Selected cart products">
          {items.map(({ product, quantity }) => {
            const unitPrice = parseFloat(product.price);
            const itemSubtotal = isNaN(unitPrice) ? 0 : unitPrice * quantity;
            const formattedItemSubtotal = `${itemSubtotal.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} ETB`;

            return (
              <article
                key={product.id}
                className="cart-item-card"
                data-testid={`cart-item-${product.id}`}
              >
                <div className="cart-item-media">
                  <span className="cart-placeholder-icon" aria-hidden="true">
                    {product.category.toLowerCase().includes('elec') ? '🔌' :
                     product.category.toLowerCase().includes('stat') ? '📚' :
                     product.category.toLowerCase().includes('cloth') ? '👕' :
                     product.category.toLowerCase().includes('food') ? '🍔' : '📦'}
                  </span>
                </div>

                <div className="cart-item-info">
                  <h3 className="cart-item-title">{product.name}</h3>
                  <div className="cart-item-tags">
                    <span className="cart-category-tag">{product.category}</span>
                    {product.campus_location && (
                      <span className="cart-campus-tag">📍 {product.campus_location}</span>
                    )}
                  </div>
                  <div className="cart-unit-price">
                    Unit Price:{' '}
                    <strong>
                      {parseFloat(product.price).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      ETB
                    </strong>
                  </div>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      aria-label={`Decrease quantity for ${product.name}`}
                    >
                      –
                    </button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      min={1}
                      max={product.stock_quantity}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        if (!isNaN(parsed)) {
                          updateQuantity(product.id, parsed);
                        }
                      }}
                      aria-label={`Quantity for ${product.name}`}
                    />
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock_quantity}
                      aria-label={`Increase quantity for ${product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <small className="cart-stock-hint">
                    Max stock: {product.stock_quantity}
                  </small>
                </div>

                <div className="cart-item-subtotal-box">
                  <span className="subtotal-label">Subtotal:</span>
                  <span className="subtotal-amount">{formattedItemSubtotal}</span>
                  <button
                    type="button"
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <aside className="cart-summary-panel" aria-label="Cart order summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-row">
            <span>Total Items:</span>
            <span>{totalItems}</span>
          </div>

          <div className="summary-row">
            <span>Merchandise Subtotal:</span>
            <strong>{formattedSubtotal}</strong>
          </div>

          <div className="summary-note">
            <small>
              ℹ️ Campus pickup point, delivery options, and payment method will be selected during checkout.
            </small>
          </div>

          <div className="summary-total-row">
            <span>Estimated Total:</span>
            <span className="total-value">{formattedSubtotal}</span>
          </div>

          <div className="summary-actions">
            {onProceedToCheckout && (
              <button
                type="button"
                className="checkout-btn"
                onClick={onProceedToCheckout}
              >
                Proceed to Checkout →
              </button>
            )}
            <button
              type="button"
              className="continue-shopping-btn"
              onClick={onContinueShopping}
            >
              ← Continue Shopping
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
