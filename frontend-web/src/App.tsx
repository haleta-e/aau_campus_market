import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, PaginationMeta } from './types/product';
import { productService } from './services/productService';
import { ApiError } from './config/api';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { FilterBar, FilterState } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { Pagination } from './components/Pagination';
import { ProductDetails } from './components/ProductDetails';
import { CartPage } from './components/CartPage';
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

export function AppContent() {
  const [currentView, setCurrentView] = useState<'catalogue' | 'details' | 'cart'>('catalogue');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

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

  const handleNavigate = (view: 'catalogue' | 'cart') => {
    setCurrentView(view);
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
        {currentView === 'cart' ? (
          <CartPage onContinueShopping={() => handleNavigate('catalogue')} />
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
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
