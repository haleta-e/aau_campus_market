import { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (productId: string) => void;
}

export function ProductGrid({
  products,
  onSelectProduct,
  favorites,
  onToggleFavorite,
}: ProductGridProps) {
  return (
    <div className="product-grid" data-testid="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelectProduct={onSelectProduct}
          isFavorite={favorites?.has(product.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
