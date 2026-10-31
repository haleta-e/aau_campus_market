import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { ApiError } from '../config/api';

interface ProductDetailsProps {
  productId: string;
  onBack: () => void;
  onViewCart: () => void;
  initialProduct?: Product;
}

export function ProductDetails({
  productId,
  onBack,
  onViewCart,
  initialProduct,
}: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState<boolean>(!initialProduct);
  const [error, setError] = useState<ApiError | null>(null);

  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const { addToCart, items } = useCart();

  useEffect(() => {
    let isMounted = true;

    async function fetchDetail() {
      if (!initialProduct) {
        setLoading(true);
      }
      setError(null);

      try {
        const data = await productService.getProductById(productId);
        if (isMounted) {
          setProduct(data);
          if (data.stock_quantity <= 0) {
            setQuantity(0);
          }
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof ApiError) {
            setError(err);
          } else {
            setError(
              new ApiError(
                'Unable to load product details. Please check your backend connection.',
                0,
                'NETWORK_ERROR'
              )
            );
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [productId, initialProduct]);

  // Find how many units of this product are already in the cart
  const existingCartItem = product ? items.find((i) => i.product.id === product.id) : undefined;
  const inCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
  const remainingStock = product ? Math.max(0, product.stock_quantity - inCartQuantity) : 0;
  const isOutOfStock = product ? product.stock_quantity <= 0 : false;

  const handleQuantityChange = (val: string) => {
    setFeedbackMessage(null);
    const parsed = parseInt(val, 10);

    if (isNaN(parsed)) {
      setQuantity(0);
      setValidationError('Please enter a valid positive whole number.');
      return;
    }

    if (parsed <= 0) {
      setQuantity(parsed);
      setValidationError('Quantity must be at least 1.');
      return;
    }

    if (product && parsed > remainingStock) {
      setQuantity(parsed);
      if (inCartQuantity > 0) {
        setValidationError(
          `You already have ${inCartQuantity} in your cart. Only ${remainingStock} more can be added (stock: ${product.stock_quantity}).`
        );
      } else {
        setValidationError(`Quantity cannot exceed available stock (${product.stock_quantity}).`);
      }
      return;
    }

    setQuantity(parsed);
    setValidationError(null);
  };

  const handleIncrement = () => {
    setFeedbackMessage(null);
    if (!product) return;
    const next = quantity + 1;
    if (next > remainingStock) {
      if (inCartQuantity > 0) {
        setValidationError(
          `Only ${remainingStock} more available (you already have ${inCartQuantity} in your cart).`
        );
      } else {
        setValidationError(`Cannot exceed available stock of ${product.stock_quantity}.`);
      }
      return;
    }
    setQuantity(next);
    setValidationError(null);
  };

  const handleDecrement = () => {
    setFeedbackMessage(null);
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
    setValidationError(null);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (isOutOfStock) {
      setValidationError('This product is out of stock.');
      return;
    }

    if (quantity <= 0 || validationError) {
      setValidationError('Please specify a valid quantity within available stock limits.');
      return;
    }

    const res = addToCart(product, quantity);
    if (res.success) {
      setFeedbackMessage(res.message);
      setValidationError(null);
      // Reset quantity to 1 or remaining available stock
      const newRemaining = remainingStock - quantity;
      setQuantity(newRemaining > 0 ? 1 : 0);
    } else {
      setValidationError(res.message);
      setFeedbackMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="product-details-container" aria-label="Loading product details">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Back to Catalogue
        </button>
        <div className="details-skeleton">
          <div className="skeleton-media shimmer" style={{ height: '280px' }} />
          <div className="skeleton-body">
            <div className="skeleton-line shimmer title" style={{ height: '28px', width: '70%' }} />
            <div className="skeleton-line shimmer text" style={{ height: '20px', width: '40%' }} />
            <div className="skeleton-line shimmer text" style={{ height: '60px', width: '100%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-container">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Back to Catalogue
        </button>
        <div className="error-card" role="alert">
          <div className="error-icon" aria-hidden="true">
            ⚠️
          </div>
          <h3 className="error-title">Unable to Load Product</h3>
          <p className="error-message">
            {error?.message || 'Product information could not be retrieved from the marketplace server.'}
          </p>
          <button
            type="button"
            className="retry-btn"
            onClick={() => {
              setLoading(true);
              setError(null);
              productService
                .getProductById(productId)
                .then((p) => setProduct(p))
                .catch((e) => setError(e))
                .finally(() => setLoading(false));
            }}
          >
            🔄 Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const numericPrice = parseFloat(product.price);
  const formattedPrice = isNaN(numericPrice)
    ? product.price
    : `${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

  return (
    <article className="product-details-container" data-testid="product-details-view">
      <nav className="details-nav">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Back to Catalogue">
          ← Back to Catalogue
        </button>
      </nav>

      {feedbackMessage && (
        <div className="feedback-banner" role="status" aria-live="polite">
          <div className="feedback-content">
            <span className="feedback-icon">✅</span>
            <span>{feedbackMessage}</span>
          </div>
          <div className="feedback-actions">
            <button type="button" className="btn-view-cart" onClick={onViewCart}>
              View Cart
            </button>
            <button type="button" className="btn-continue" onClick={onBack}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className="details-layout">
        <div className="details-media-panel">
          <div className="details-placeholder-icon" aria-hidden="true">
            {product.category.toLowerCase().includes('elec') ? '🔌' :
             product.category.toLowerCase().includes('stat') ? '📚' :
             product.category.toLowerCase().includes('cloth') ? '👕' :
             product.category.toLowerCase().includes('food') ? '🍔' : '📦'}
          </div>
          <span className="details-category-badge">{product.category}</span>
        </div>

        <div className="details-info-panel">
          <h1 className="details-title">{product.name}</h1>

          <div className="details-price-badge">{formattedPrice}</div>

          <div className="details-meta-box">
            {product.store_name && (
              <div className="meta-item">
                <span className="meta-label">🏪 Store:</span>
                <span className="meta-value">{product.store_name}</span>
              </div>
            )}
            {product.campus_location && (
              <div className="meta-item">
                <span className="meta-label">📍 Campus:</span>
                <span className="meta-value">{product.campus_location}</span>
              </div>
            )}
            {product.seller_phone && (
              <div className="meta-item">
                <span className="meta-label">📞 Contact:</span>
                <span className="meta-value">{product.seller_phone}</span>
              </div>
            )}
          </div>

          <div className="details-stock-section">
            <span className="stock-label">Availability:</span>
            {isOutOfStock ? (
              <span className="stock-badge stock-out">Out of Stock</span>
            ) : product.stock_quantity <= 5 ? (
              <span className="stock-badge stock-low">Low Stock — Only {product.stock_quantity} left</span>
            ) : (
              <span className="stock-badge stock-available">In Stock ({product.stock_quantity} available)</span>
            )}
            {inCartQuantity > 0 && (
              <span className="in-cart-note">
                (You have <strong>{inCartQuantity}</strong> in your cart)
              </span>
            )}
          </div>

          <div className="details-description-box">
            <h2 className="section-subtitle">Description</h2>
            <p className="description-text">
              {product.description && product.description.trim() !== ''
                ? product.description
                : 'No additional description provided for this campus item.'}
            </p>
          </div>

          <div className="purchase-controls">
            {!isOutOfStock && remainingStock > 0 ? (
              <>
                <div className="quantity-control-group">
                  <label htmlFor="quantity-input" className="quantity-label">
                    Quantity:
                  </label>
                  <div className="quantity-stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      –
                    </button>
                    <input
                      id="quantity-input"
                      type="number"
                      className="quantity-input"
                      value={quantity}
                      min={1}
                      max={remainingStock}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      aria-label="Product quantity"
                    />
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={handleIncrement}
                      disabled={quantity >= remainingStock}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {validationError && (
                  <p className="validation-error-msg" role="alert">
                    ⚠️ {validationError}
                  </p>
                )}

                <button
                  type="button"
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={quantity <= 0 || Boolean(validationError)}
                >
                  🛒 Add to Cart
                </button>
              </>
            ) : isOutOfStock ? (
              <div className="stock-alert-box out-of-stock-alert">
                <p>This item is currently out of stock and cannot be ordered.</p>
              </div>
            ) : (
              <div className="stock-alert-box max-cart-alert">
                <p>You have already added all available stock ({product.stock_quantity}) to your shopping cart.</p>
                <button type="button" className="btn-view-cart" onClick={onViewCart}>
                  View in Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
