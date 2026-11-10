import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, ShoppingBag, User, LogOut, Shield, LayoutGrid, X } from 'lucide-react';

export type AppView =
  | 'catalogue'
  | 'details'
  | 'cart'
  | 'login'
  | 'checkout'
  | 'orders'
  | 'order-confirmation'
  | 'order-detail'
  | 'admin';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onCategorySelect?: (category: string) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

export function Header({
  currentView,
  onNavigate,
  searchTerm = '',
  onSearchChange,
  onCategorySelect,
  favoritesCount = 0,
  onOpenFavorites,
}: HeaderProps) {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    if (currentView === 'orders' || currentView === 'checkout' || currentView === 'admin') {
      onNavigate('catalogue');
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Books',
    'Beauty',
    'Home essentials',
    'Stationery',
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Left: Brand Logo */}
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
          <div className="brand-text">
            <h1 className="brand-title">AAU Campus Market</h1>
            <p className="brand-subtitle">Addis Ababa University</p>
          </div>
        </div>

        {/* Middle: Modern Search Bar */}
        <div className="header-search-bar" role="search">
          <Search className="search-icon" size={18} aria-hidden="true" />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search electronics, books, dorm essentials, fashion..."
            value={searchTerm}
            onChange={(e) => {
              if (onSearchChange) onSearchChange(e.target.value);
              if (currentView !== 'catalogue') onNavigate('catalogue');
            }}
            aria-label="Search products"
          />
          {searchTerm && onSearchChange && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Right Navigation: Categories, Favorites, Cart, Profile */}
        <div className="header-actions">
          <nav className="header-nav" aria-label="Main Navigation">
            {/* Categories Dropdown / Quick Trigger */}
            <div className="nav-dropdown-wrapper">
              <button
                type="button"
                className={`nav-btn btn-categories-trigger ${currentView === 'catalogue' ? 'active' : ''}`}
                onClick={() => {
                  setShowCategoryMenu(!showCategoryMenu);
                  if (currentView !== 'catalogue') onNavigate('catalogue');
                }}
                aria-label="Go to Product Catalogue"
                aria-expanded={showCategoryMenu}
              >
                <LayoutGrid size={18} className="nav-icon" />
                <span>Categories</span>
              </button>

              {showCategoryMenu && (
                <div className="categories-dropdown-menu">
                  <div className="dropdown-header">Shop by Department</div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className="category-dropdown-item"
                      onClick={() => {
                        if (onCategorySelect) onCategorySelect(cat);
                        setShowCategoryMenu(false);
                        if (currentView !== 'catalogue') onNavigate('catalogue');
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="category-dropdown-item view-all"
                    onClick={() => {
                      if (onCategorySelect) onCategorySelect('');
                      setShowCategoryMenu(false);
                      onNavigate('catalogue');
                    }}
                  >
                    View All Products →
                  </button>
                </div>
              )}
            </div>

            {/* Favorites Icon Button */}
            <button
              type="button"
              className="nav-btn nav-icon-btn btn-favorites"
              onClick={() => {
                if (onOpenFavorites) onOpenFavorites();
                else onNavigate('catalogue');
              }}
              aria-label={`Favorites (${favoritesCount})`}
              title="Saved Favorites"
            >
              <Heart size={18} className="nav-icon" />
              <span className="nav-label-desktop">Favorites</span>
              {favoritesCount > 0 && <span className="counter-badge pink-badge">{favoritesCount}</span>}
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              className={`nav-btn cart-nav-btn ${currentView === 'cart' ? 'active' : ''}`}
              onClick={() => onNavigate('cart')}
              aria-label={`Shopping Cart with ${totalItems} items`}
            >
              <ShoppingBag size={18} className="nav-icon" />
              <span>🛒 Cart</span>
              {totalItems > 0 && <span className="cart-counter-badge">{totalItems}</span>}
            </button>

            {/* User Profile / Auth Cluster */}
            {isAuthenticated && user ? (
              <div className="auth-nav-cluster" data-testid="auth-user-menu">
                <button
                  type="button"
                  className={`nav-btn ${currentView === 'orders' ? 'active' : ''}`}
                  onClick={() => onNavigate('orders')}
                  aria-label="View My Orders"
                >
                  <span>📋 My Orders</span>
                </button>
                {user.role === 'ADMIN' && (
                  <button
                    type="button"
                    className={`nav-btn btn-admin-nav ${currentView === 'admin' ? 'active' : ''}`}
                    onClick={() => onNavigate('admin')}
                    aria-label="Open Admin Dashboard"
                  >
                    <Shield size={16} />
                    <span>Admin</span>
                  </button>
                )}
                <div className="user-profile-badge" title={`Signed in as ${user.email}`}>
                  <User size={15} />
                  <span className="user-name">{user.username}</span>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
                </div>
                <button
                  type="button"
                  className="nav-btn btn-logout"
                  onClick={handleLogout}
                  aria-label="Sign out of your account"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={`nav-btn btn-login-nav ${currentView === 'login' ? 'active' : ''}`}
                onClick={() => onNavigate('login')}
                aria-label="Sign in to your student account"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
