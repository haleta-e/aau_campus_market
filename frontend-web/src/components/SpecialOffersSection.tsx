import { Sparkles, TrendingUp, Tag, Award, ArrowRight } from 'lucide-react';
import { Product } from '../types/product';
import { getCampusEmoji } from '../utils/emojiMap';
import { getProductImageUrl } from '../utils/productImages';

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
}: SpecialOffersSectionProps) {
  // Filter products based on active tab
  const getDisplayedProducts = () => {
    if (!products.length) return [];

    switch (activeTab) {
      case 'deals':
        return products.slice(0, 4);
      case 'discounts':
        return [...products].sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0, 4);
      case 'new-arrivals':
        return [...products].reverse().slice(0, 4);
      case 'best-sellers':
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

        {/* Distinctive Special Offer Spotlight Cards */}
        <div className="special-offers-grid">
          {displayed.map((product) => {
            const numericPrice = parseFloat(product.price);
            const formattedPrice = isNaN(numericPrice)
              ? product.price
              : `${numericPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`;
            const originalPrice = !isNaN(numericPrice)
              ? `${(numericPrice * 1.2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB`
              : null;

            return (
              <div
                key={`special-${product.id}`}
                className="special-offer-card"
                onClick={() => onSelectProduct(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectProduct(product);
                }}
              >
                <div className="special-card-media">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    className="special-card-image"
                    loading="lazy"
                  />
                  <span className="special-deal-tag">Featured Deal</span>
                </div>
                <div className="special-card-content">
                  <span className="special-category-pill">{product.category}</span>
                  <div className="special-item-title" title={product.name}>
                    {product.name} [Special Deal]
                  </div>
                  <div className="special-price-row">
                    <span className="special-price">{formattedPrice}</span>
                    {originalPrice && <span className="special-orig-price">{originalPrice}</span>}
                  </div>
                  <div className="special-campus-row">
                    <span>{getCampusEmoji(product.campus_location || '')} {product.campus_location || 'All Campuses'}</span>
                  </div>
                </div>
              </div>
            );
          })}
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
