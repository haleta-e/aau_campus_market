import { Sparkles, TrendingUp, Tag, Award, ArrowRight } from 'lucide-react';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface SpecialOffersSectionProps {
  products: Product[];
  activeTab: 'deals' | 'discounts' | 'new-arrivals' | 'best-sellers';
  onTabChange: (tab: 'deals' | 'discounts' | 'new-arrivals' | 'best-sellers') => void;
  onSelectProduct: (product: Product) => void;
  onViewAllOffers: () => void;
  favorites?: Set<string>;
  onToggleFavorite?: (productId: string) => void;
}

export function SpecialOffersSection({
  products,
  activeTab,
  onTabChange,
  onSelectProduct,
  onViewAllOffers,
  favorites,
  onToggleFavorite,
}: SpecialOffersSectionProps) {
  // Filter products based on active tab
  const getDisplayedProducts = () => {
    if (!products.length) return [];

    switch (activeTab) {
      case 'deals':
        // Today's deals: low stock or specific affordable student essentials
        return products.slice(0, 4);
      case 'discounts':
        // High-ticket items with biggest value savings
        return [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 4);
      case 'new-arrivals':
        // New arrivals: sort by date or take recent items
        return [...products].reverse().slice(0, 4);
      case 'best-sellers':
        // Best sellers: high stock / popular items
        return [...products].sort((a, b) => b.stock_quantity - a.stock_quantity).slice(0, 4);
      default:
        return products.slice(0, 4);
    }
  };

  const displayed = getDisplayedProducts();

  return (
    <section className="special-offers-section" aria-label="Special Offers and Featured Collections">
      <div className="special-offers-banner">
        <div className="special-offers-header">
          <div className="offers-badge-row">
            <span className="offers-glow-badge">
              <Sparkles size={14} /> Limited Campus Deals
            </span>
          </div>
          <h2 className="special-offers-title">Today&apos;s Special Offers & Hot Picks</h2>
          <p className="special-offers-desc">
            Save more on certified student gear, dorm essentials, and electronics with instant campus pickup.
          </p>

          {/* Distinctive navigation tabs */}
          <div className="offers-tabs-list" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'deals'}
              className={`offers-tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
              onClick={() => onTabChange('deals')}
            >
              <Tag size={16} />
              <span>Today&apos;s Deals</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'discounts'}
              className={`offers-tab-btn ${activeTab === 'discounts' ? 'active' : ''}`}
              onClick={() => onTabChange('discounts')}
            >
              <Sparkles size={16} />
              <span>Discounts</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'new-arrivals'}
              className={`offers-tab-btn ${activeTab === 'new-arrivals' ? 'active' : ''}`}
              onClick={() => onTabChange('new-arrivals')}
            >
              <TrendingUp size={16} />
              <span>New Arrivals</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'best-sellers'}
              className={`offers-tab-btn ${activeTab === 'best-sellers' ? 'active' : ''}`}
              onClick={() => onTabChange('best-sellers')}
            >
              <Award size={16} />
              <span>Best Sellers</span>
            </button>
          </div>
        </div>

        {/* Product Cards for the Special Offers */}
        <div className="special-offers-grid">
          {displayed.map((product) => (
            <ProductCard
              key={`special-${product.id}`}
              product={product}
              onSelectProduct={onSelectProduct}
              isFavorite={favorites?.has(product.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        <div className="offers-footer-action">
          <button
            type="button"
            className="offers-explore-all-btn"
            onClick={onViewAllOffers}
            aria-label="View all campus special offers"
          >
            <span>Explore All Deals & Promotions</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
