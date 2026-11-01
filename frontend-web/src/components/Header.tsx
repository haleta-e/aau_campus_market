import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export type AppView =
  | 'catalogue'
  | 'details'
  | 'cart'
  | 'login'
  | 'checkout'
  | 'orders'
  | 'order-confirmation'
  | 'order-detail';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    if (currentView === 'orders' || currentView === 'checkout') {
      onNavigate('catalogue');
    }
  };

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

            {isAuthenticated && user ? (
              <div className="auth-nav-cluster" data-testid="auth-user-menu">
                <button
                  type="button"
                  className={`nav-btn ${currentView === 'orders' ? 'active' : ''}`}
                  onClick={() => onNavigate('orders')}
                  aria-label="View My Orders"
                >
                  📋 My Orders
                </button>
                <div className="user-profile-badge" title={`Signed in as ${user.email}`}>
                  <span className="user-name">👤 {user.username}</span>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
                </div>
                <button
                  type="button"
                  className="nav-btn btn-logout"
                  onClick={handleLogout}
                  aria-label="Sign out of your account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`nav-btn btn-login-nav ${currentView === 'login' ? 'active' : ''}`}
                onClick={() => onNavigate('login')}
                aria-label="Sign in to your student account"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
