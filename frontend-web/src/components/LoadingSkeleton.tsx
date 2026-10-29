export function LoadingSkeleton() {
  return (
    <div className="skeleton-grid" aria-label="Loading products...">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton-card" data-testid="loading-skeleton">
          <div className="skeleton-media shimmer" />
          <div className="skeleton-body">
            <div className="skeleton-line shimmer title" />
            <div className="skeleton-line shimmer text" />
            <div className="skeleton-line shimmer meta" />
            <div className="skeleton-line shimmer price" />
          </div>
        </div>
      ))}
    </div>
  );
}
