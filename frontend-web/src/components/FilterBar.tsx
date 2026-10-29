export interface FilterState {
  search: string;
  category: string;
  campus: string;
  inStockOnly: boolean;
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'name-asc';
}

interface FilterBarProps {
  filters: FilterState;
  categories: string[];
  campuses: string[];
  totalResults: number;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
}

export function FilterBar({
  filters,
  categories,
  campuses,
  totalResults,
  onFilterChange,
  onResetFilters,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== '' ||
    filters.campus !== '' ||
    filters.inStockOnly ||
    filters.sortBy !== 'default';

  return (
    <div className="filter-bar-container">
      <div className="search-row">
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search products by name (e.g. Flash Drive, Notebook, Calculator)..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            aria-label="Search products"
          />
          {filters.search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onFilterChange('search', '')}
              aria-label="Clear search text"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="controls-row">
        <div className="select-group">
          <label htmlFor="category-select" className="filter-label">
            Category
          </label>
          <select
            id="category-select"
            className="filter-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label htmlFor="campus-select" className="filter-label">
            Campus
          </label>
          <select
            id="campus-select"
            className="filter-select"
            value={filters.campus}
            onChange={(e) => onFilterChange('campus', e.target.value)}
          >
            <option value="">All Campuses</option>
            {campuses.map((camp) => (
              <option key={camp} value={camp}>
                {camp}
              </option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label htmlFor="sort-select" className="filter-label">
            Sort By
          </label>
          <select
            id="sort-select"
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange('sortBy', e.target.value as FilterState['sortBy'])
            }
          >
            <option value="default">Default Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange('inStockOnly', e.target.checked)}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={onResetFilters}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="results-summary">
        <span className="results-count">
          Showing <strong>{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'}
        </span>
      </div>
    </div>
  );
}
