export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-group">
          <div className="brand-logo" aria-hidden="true">
            AAU
          </div>
          <div>
            <h1 className="brand-title">AAU Campus Market</h1>
            <p className="brand-subtitle">Addis Ababa University Student Marketplace</p>
          </div>
        </div>
        <div className="campus-badges" aria-label="Supported Campuses">
          <span className="campus-badge">4 Kilo</span>
          <span className="campus-badge">5 Kilo</span>
          <span className="campus-badge">6 Kilo</span>
          <span className="campus-badge">Sefer Selam</span>
          <span className="campus-badge">Mexico</span>
          <span className="campus-badge">Ledeta</span>
        </div>
      </div>
    </header>
  );
}
