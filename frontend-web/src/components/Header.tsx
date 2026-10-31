import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentView: 'catalogue' | 'details' | 'cart';
  onNavigate: (view: 'catalogue' | 'cart') => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="header-inner">
        <div
          className="brand-group clickable"
          onClick={() => onNavigate('catalogue')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onNavigate('catalogue');
          }}
          aria-label="AAU Campus Market Home"
        >
          <div className="brand-logo" aria-hidden="true">
            AAU
          </div>
          <div>
            <h1 className="brand-title">AAU Campus Market</h1>
            <p className="brand-subtitle">Addis Ababa University Student Marketplace</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="campus-badges" aria-label="Supported Campuses">
            <span className="campus-badge">4 Kilo</span>
            <span className="campus-badge">5 Kilo</span>
            <span className="campus-badge">6 Kilo</span>
            <span className="campus-badge">Sefer Selam</span>
            <span className="campus-badge">Mexico</span>
            <span className="campus-badge">Ledeta</span>
          </div>

          <nav className="header-nav" aria-label="Main Navigation">
            <button
              type="button"
              className={`nav-btn ${currentView === 'catalogue' || currentView === 'details' ? 'active' : ''}`}
              onClick={() => onNavigate('catalogue')}
              aria-label="Go to Product Catalogue"
            >
              Catalogue
            </button>
            <button
              type="button"
              className={`nav-btn cart-nav-btn ${currentView === 'cart' ? 'active' : ''}`}
              onClick={() => onNavigate('cart')}
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <span>🛒 Cart</span>
              {totalItems > 0 && <span className="cart-counter-badge">{totalItems}</span>}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
