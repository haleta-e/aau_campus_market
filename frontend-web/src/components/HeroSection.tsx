import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onSpecialOffersClick?: () => void;
}

export function HeroSection({ onExploreClick, onSpecialOffersClick }: HeroSectionProps) {
  return (
    <section className="hero-section" aria-label="Hero promotion banner">
      <div className="hero-container">
        {/* Left text & call to action */}
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={16} className="pill-icon" />
            <span>Official AAU Student Marketplace</span>
          </div>

          <h1 className="hero-title">
            Campus Shopping, <span className="text-gradient">Elevated & Easy</span>
          </h1>

          <p className="hero-description">
            Buy and sell textbooks, dorm gear, electronics, stationery, and varsity apparel across all 6 AAU campuses with verified student sellers and secure campus pickups.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="hero-btn-primary"
              onClick={onExploreClick}
              aria-label="Explore products now"
            >
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </button>

            {onSpecialOffersClick && (
              <button
                type="button"
                className="hero-btn-secondary"
                onClick={onSpecialOffersClick}
                aria-label="View today's special offers"
              >
                <span>View Special Offers</span>
              </button>
            )}
          </div>

          <div className="hero-features-strip">
            <div className="feature-item">
              <ShieldCheck size={16} className="feature-icon" />
              <span>Verified AAU Students</span>
            </div>
            <div className="feature-item">
              <ShoppingBag size={16} className="feature-icon" />
              <span>Campus Pickups & Delivery</span>
            </div>
          </div>
        </div>

        {/* Right illustration / graphic banner */}
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-graphic-card">
            <div className="hero-floating-bubble bubble-1">
              <span className="bubble-emoji">⚡</span>
              <div>
                <span className="bubble-title">Student Deals</span>
                <span className="bubble-sub">Up to 30% Off</span>
              </div>
            </div>

            <div className="hero-floating-bubble bubble-2">
              <span className="bubble-emoji">🎓</span>
              <div>
                <span className="bubble-title">6 Campuses</span>
                <span className="bubble-sub">4 Kilo, 5 Kilo, 6 Kilo...</span>
              </div>
            </div>

            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
              alt="Students shopping and collaborating on campus"
              className="hero-main-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
