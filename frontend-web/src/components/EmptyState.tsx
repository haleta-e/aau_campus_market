interface EmptyStateProps {
  isFiltered: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ isFiltered, onClearFilters }: EmptyStateProps) {
  return (
    <div className="empty-state" data-testid="empty-state">
      <div className="empty-icon" aria-hidden="true">
        {isFiltered ? '🔍' : '📦'}
      </div>
      <h3 className="empty-title">
        {isFiltered ? 'No Matching Products Found' : 'Catalogue Is Currently Empty'}
      </h3>
      <p className="empty-description">
        {isFiltered
          ? 'No products matched your search keyword or selected filters. Try searching for something else or clearing your filters.'
          : 'There are currently no active product listings available in the AAU Campus Market. Please check back later.'}
      </p>
      {isFiltered && onClearFilters && (
        <button type="button" className="clear-filters-btn" onClick={onClearFilters}>
          Clear All Filters
        </button>
      )}
    </div>
  );
}
