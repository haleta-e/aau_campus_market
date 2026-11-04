import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, PaginationMeta } from './types/product';
import { productService } from './services/productService';
import { ApiError } from './config/api';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header, AppView } from './components/Header';
import { FilterBar, FilterState } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { Pagination } from './components/Pagination';
import { ProductDetails } from './components/ProductDetails';
import { CartPage } from './components/CartPage';
import { LoginPage } from './components/LoginPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { OrderDetailView } from './components/OrderDetailView';
import { AdminDashboard } from './components/AdminDashboard';
import { PlacedOrderConfirmation } from './types/order';
import './App.css';

const INITIAL_FILTERS: FilterState = {
  search: '',
  category: '',
  campus: '',
  inStockOnly: false,
  sortBy: 'default',
};

const AAU_CAMPUSES = [
  '4 Kilo Campus',
  '5 Kilo Campus',
  '6 Kilo Campus',
  'Sefer Selam Campus',
  'Mexico Campus',
  'Ledeta Campus',
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo-1',
    seller_id: 'demo-seller-1',
    name: 'USB 3.0 Flash Drive 64GB High Speed',
    description: 'Ultra-fast data transfer for course assignments, lab software, and lecture slides.',
    category: 'Electronics',
    price: '450.00',
    stock_quantity: 18,
    status: 'ACTIVE',
    created_at: '2026-10-30T10:00:00.000Z',
    updated_at: '2026-10-30T10:00:00.000Z',
    store_name: '4 Kilo Tech Hub',
    campus_location: '4 Kilo Campus',
  },
  {
    id: 'demo-2',
    seller_id: 'demo-seller-2',
    name: 'A4 Grid Hardcover Notebook 200 Pages',
    description: 'High-quality ruled paper perfect for engineering, mathematics, and natural science lectures.',
    category: 'Stationery',
    price: '180.00',
    stock_quantity: 45,
    status: 'ACTIVE',
    created_at: '2026-10-30T10:00:00.000Z',
    updated_at: '2026-10-30T10:00:00.000Z',
    store_name: '5 Kilo Bookshop',
    campus_location: '5 Kilo Campus',
  },
  {
    id: 'demo-3',
    seller_id: 'demo-seller-1',
    name: 'Scientific Calculator fx-991EX ClassWiz',
    description: 'AAU Exam Board approved advanced scientific calculator with 552 functions.',
    category: 'Electronics',
    price: '1450.00',
    stock_quantity: 6,
    status: 'ACTIVE',
    created_at: '2026-10-30T10:00:00.000Z',
    updated_at: '2026-10-30T10:00:00.000Z',
    store_name: '4 Kilo Tech Hub',
    campus_location: '4 Kilo Campus',
  },
  {
    id: 'demo-4',
    seller_id: 'demo-seller-3',
    name: 'AAU Department Hoodie (Navy Blue, Size L)',
    description: 'Warm collegiate fleece hoodie with Addis Ababa University embroidered crest.',
    category: 'Clothing',
    price: '950.00',
    stock_quantity: 12,
    status: 'ACTIVE',
    created_at: '2026-10-30T10:00:00.000Z',
    updated_at: '2026-10-30T10:00:00.000Z',
    store_name: '6 Kilo Apparel',
    campus_location: '6 Kilo Campus',
  },
  {
    id: 'demo-5',
    seller_id: 'demo-seller-4',
    name: 'Organic Roasted Ethiopian Coffee Beans (500g)',
    description: 'Freshly roasted Sidama single-origin whole bean coffee for late-night study sessions.',
    category: 'Food',
    price: '380.00',
    stock_quantity: 25,
    status: 'ACTIVE',
    created_at: '2026-10-30T10:00:00.000Z',
    updated_at: '2026-10-30T10:00:00.000Z',
    store_name: 'Sefer Selam Roasters',
    campus_location: 'Sefer Selam Campus',
  },
  {
    id: 'demo-6',
    seller_id: 'demo-seller-5',
    name: 'Antibacterial Hand Sanitizer & Laundry Soap Set',
    description: 'Dormitory care pack with 500ml pump sanitizer and lavender laundry detergent bar.',
    category: 'Sanitary',
    price: '140.00',
    stock_quantity: 30,
    status: 'ACTIVE',
    created_at: '2026-10-30T10:00:00.000Z',
    updated_at: '2026-10-30T10:00:00.000Z',
    store_name: 'Ledeta Health Corner',
    campus_location: 'Ledeta Campus',
  },
  {
    id: 'demo-7',
    seller_id: 'demo-seller-2',
    name: 'Ballpoint Pens Box (Pack of 12, Blue & Black)',
    description: 'Smooth writing 0.7mm tip pens for exams and note taking.',
    category: 'Stationery',
    price: '95.00',
    stock_quantity: 40,
    status: 'ACTIVE',
    created_at: '2026-10-30T10:00:00.000Z',
    updated_at: '2026-10-30T10:00:00.000Z',
    store_name: '5 Kilo Bookshop',
    campus_location: '5 Kilo Campus',
  },
  {
    id: 'demo-8',
    seller_id: 'demo-seller-6',
    name: 'Wireless Bluetooth Ergonomic Mouse',
    description: 'Rechargeable silent-click wireless mouse with USB receiver for laptops and tablets.',
    category: 'Electronics',
    price: '620.00',
    stock_quantity: 9,
    status: 'ACTIVE',
    created_at: '2026-10-30T10:00:00.000Z',
    updated_at: '2026-10-30T10:00:00.000Z',
    store_name: 'Mexico Campus Digital',
    campus_location: 'Mexico Campus',
  },
];

export function AppContent() {
  const { isAuthenticated, user } = useAuth();

  const [currentView, setCurrentView] = useState<AppView>('catalogue');
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<AppView | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | undefined>(undefined);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const [orderConfirmation, setOrderConfirmation] = useState<PlacedOrderConfirmation | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Debounced search term for API queries
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [filters.search]);

  // Fetch products from backend
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts({
        page,
        limit: 20,
        search: debouncedSearch.trim() || undefined,
        category: filters.category || undefined,
      });

      setProducts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError(new ApiError('An unexpected error occurred while loading products.', 0, 'UNKNOWN_ERROR'));
      }
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters.category]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Extract unique categories available from products or default set
  const categories = useMemo(() => {
    const defaultCategories = ['Electronics', 'Stationery', 'Books', 'Clothing', 'Accessories', 'Food'];
    const dynamicCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    return Array.from(new Set([...dynamicCategories, ...defaultCategories]));
  }, [products]);

  // Filter and sort products client-side for campus, stock, and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Campus filter
        if (filters.campus) {
          const productCampus = product.campus_location?.toLowerCase() || '';
          const targetCampus = filters.campus.toLowerCase();
          if (!productCampus.includes(targetCampus.replace(' campus', ''))) {
            return false;
          }
        }

        // In-stock only filter
        if (filters.inStockOnly && product.stock_quantity <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') {
          return parseFloat(a.price) - parseFloat(b.price);
        }
        if (filters.sortBy === 'price-desc') {
          return parseFloat(b.price) - parseFloat(a.price);
        }
        if (filters.sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        return 0; // default order from API
      });
  }, [products, filters.campus, filters.inStockOnly, filters.sortBy]);

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setSelectedProduct(product);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: AppView) => {
    // Route guard: protected views require authentication
    if ((view === 'checkout' || view === 'orders' || view === 'order-detail') && !isAuthenticated) {
      setRedirectAfterLogin(view === 'order-detail' ? 'orders' : view);
      setLoginMessage(
        view === 'checkout'
          ? 'Please sign in to proceed with your order checkout.'
          : 'Please sign in to view your orders.'
      );
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Admin route guard: only ADMIN role may access admin dashboard
    if (view === 'admin' && (!isAuthenticated || user?.role !== 'ADMIN')) {
      setRedirectAfterLogin(null);
      setLoginMessage('Administrator access is required to view that page.');
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoginMessage(undefined);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    const target = redirectAfterLogin || 'catalogue';
    setRedirectAfterLogin(null);
    setLoginMessage(undefined);
    setCurrentView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.category !== '' ||
    filters.campus !== '' ||
    filters.inStockOnly;

  return (
    <div className="app-container">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      <main className="main-content">
        {currentView === 'login' ? (
          <LoginPage
            onSuccess={handleLoginSuccess}
            onCancel={() => handleNavigate('catalogue')}
            message={loginMessage}
          />
        ) : currentView === 'cart' ? (
          <CartPage
            onContinueShopping={() => handleNavigate('catalogue')}
            onProceedToCheckout={() => handleNavigate('checkout')}
          />
        ) : currentView === 'checkout' ? (
          <CheckoutPage
            onBackToCart={() => handleNavigate('cart')}
            onOrderPlaced={(confirmation) => {
              setOrderConfirmation(confirmation);
              setCurrentView('order-confirmation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'order-confirmation' && orderConfirmation ? (
          <OrderConfirmation
            confirmation={orderConfirmation}
            onContinueShopping={() => {
              setOrderConfirmation(null);
              handleNavigate('catalogue');
            }}
            onViewOrders={() => {
              setOrderConfirmation(null);
              handleNavigate('orders');
            }}
          />
        ) : currentView === 'orders' ? (
          <OrderHistoryPage
            onViewDetail={(orderId) => {
              setSelectedOrderId(orderId);
              setCurrentView('order-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => handleNavigate('catalogue')}
          />
        ) : currentView === 'order-detail' && selectedOrderId ? (
          <OrderDetailView
            orderId={selectedOrderId}
            onBack={() => {
              setSelectedOrderId(null);
              setCurrentView('orders');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'admin' && user?.role === 'ADMIN' ? (
          <AdminDashboard />
        ) : currentView === 'details' && selectedProductId ? (
          <ProductDetails
            productId={selectedProductId}
            initialProduct={selectedProduct}
            onBack={() => handleNavigate('catalogue')}
            onViewCart={() => handleNavigate('cart')}
          />
        ) : (
          <>
            <FilterBar
              filters={filters}
              categories={categories}
              campuses={AAU_CAMPUSES}
              totalResults={filteredProducts.length}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
            />

            {loading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorMessage
                message={error.message}
                statusCode={error.statusCode}
                code={error.code}
                onRetry={loadProducts}
                onLoadDemo={() => {
                  setProducts(DEMO_PRODUCTS);
                  setError(null);
                }}
              />
            ) : products.length === 0 ? (
              <EmptyState isFiltered={isFiltered} onClearFilters={handleResetFilters} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState isFiltered={true} onClearFilters={handleResetFilters} />
            ) : (
              <>
                <ProductGrid
                  products={filteredProducts}
                  onSelectProduct={handleSelectProduct}
                />
                {pagination && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>© 2026 Addis Ababa University Campus Market — University Student Commerce Platform</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
