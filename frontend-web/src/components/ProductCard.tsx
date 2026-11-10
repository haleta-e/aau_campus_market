import { useContext } from 'react';
import { Product } from '../types/product';
import { getCampusEmoji } from '../utils/emojiMap';
import { getProductImageUrl } from '../utils/productImages';
import { Star, Heart, ShoppingBag, Eye, Percent } from 'lucide-react';
import { CartContext } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct?: (product: Product) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
}

export function ProductCard({
  product,
  onSelectProduct,
  isFavorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  // Safe optional consumption of CartContext so standalone component tests don't require CartProvider
  const cartCtx = useContext(CartContext);
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const numericPrice = parseFloat(product.price);
  const formattedPrice = isNaN(numericPrice)
    ? product.price
    : `${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

  // Calculated discount simulation for rich showcase (e.g., 10% - 20% on select items)
  const hasDiscount = (product.id.charCodeAt(product.id.length - 1) % 2 === 0);
  const discountPercent = hasDiscount ? 15 : 0;
  const originalPrice = hasDiscount && !isNaN(numericPrice)
    ? (numericPrice * 1.18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  // Star rating calculation based on id hash for consistent visual rating
  const ratingScore = 4.0 + (product.name.length % 10) * 0.1;

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (cartCtx?.addItem) {
      cartCtx.addItem(product, 1);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  return (
    <article
      className="product-card clickable"
      data-testid={`product-card-${product.id}`}
      onClick={handleCardClick}
      role={onSelectProduct ? 'button' : 'article'}
      tabIndex={onSelectProduct ? 0 : undefined}
      onKeyDown={(e) => {
        if (onSelectProduct && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelectProduct(product);
        }
      }}
      aria-label={`View details for ${product.name}`}
    >
      <div className="product-card-media">
        <img
          src={getProductImageUrl(product)}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />
        <div className="product-media-overlay" aria-hidden="true" />
        
        {/* Category Badge */}
        <span className="product-category-tag">{product.category}</span>

        {/* Discount Badge if available */}
        {hasDiscount && (
          <span className="product-discount-badge" aria-label={`${discountPercent}% discount`}>
            <Percent size={11} /> {discountPercent}% OFF
          </span>
        )}

        {/* Favorite Icon Button */}
        <button
          type="button"
          className={`product-card-favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'In your favorites' : 'Save to favorites'}
        >
          <Heart size={18} fill={isFavorite ? '#ec4899' : 'none'} color={isFavorite ? '#ec4899' : '#ffffff'} />
        </button>
      </div>

      <div className="product-card-body">
        {/* Rating Row */}
        <div className="product-rating-row" aria-label={`Rating: ${ratingScore.toFixed(1)} out of 5 stars`}>
          <div className="rating-stars" aria-hidden="true">
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span className="rating-score">{ratingScore.toFixed(1)}</span>
          </div>
          <span className="rating-reviews-count">({(product.stock_quantity * 3) + 8} reviews)</span>
        </div>

        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        {product.description && (
          <p className="product-description" title={product.description}>
            {product.description}
          </p>
        )}

        <div className="product-meta">
          {product.store_name && (
            <span className="product-seller" title={`Seller: ${product.store_name}`}>
              🏪 {product.store_name}
            </span>
          )}
          {product.campus_location && (
            <span className="product-campus" title={`Campus: ${product.campus_location}`}>
              {getCampusEmoji(product.campus_location)} {product.campus_location}
            </span>
          )}
        </div>

        <div className="product-card-footer">
          <div className="price-container">
            <div className="product-price" aria-label={`Price: ${formattedPrice}`}>
              {formattedPrice}
            </div>
            {originalPrice && (
              <span className="product-original-price" aria-hidden="true">
                {originalPrice} ETB
              </span>
            )}
          </div>

          <div className="product-stock-wrapper">
            {isOutOfStock ? (
              <span className="stock-badge stock-out" aria-label="Out of stock">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="stock-badge stock-low" aria-label={`Low stock: ${product.stock_quantity} remaining`}>
                Only {product.stock_quantity} left
              </span>
            ) : (
              <span className="stock-badge stock-available" aria-label={`In stock: ${product.stock_quantity} available`}>
                In Stock ({product.stock_quantity})
              </span>
            )}
          </div>
        </div>

        {/* Action Row: Add to Cart and View Details */}
        <div className="card-action-row">
          <button
            type="button"
            className="btn-add-to-cart-quick"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </button>

          <button
            type="button"
            className="view-details-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectProduct) onSelectProduct(product);
            }}
            aria-label={`View full details for ${product.name}`}
          >
            <Eye size={15} />
            <span>Details</span>
          </button>
        </div>
      </div>
    </article>
  );
}
