import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  const numericPrice = parseFloat(product.price);
  const formattedPrice = isNaN(numericPrice)
    ? product.price
    : `${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;

  return (
    <article className="product-card" data-testid={`product-card-${product.id}`}>
      <div className="product-card-media">
        <div className="product-placeholder-icon" aria-hidden="true">
          {product.category.toLowerCase().includes('elec') ? '🔌' :
           product.category.toLowerCase().includes('stat') ? '📚' :
           product.category.toLowerCase().includes('cloth') ? '👕' :
           product.category.toLowerCase().includes('food') ? '🍔' : '📦'}
        </div>
        <span className="product-category-tag">{product.category}</span>
      </div>

      <div className="product-card-body">
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
              📍 {product.campus_location}
            </span>
          )}
        </div>

        <div className="product-card-footer">
          <div className="product-price" aria-label={`Price: ${formattedPrice}`}>
            {formattedPrice}
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
      </div>
    </article>
  );
}
