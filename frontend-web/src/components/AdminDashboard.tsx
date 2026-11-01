import { useState, useEffect } from 'react';
import { getAdminStats } from '../services/adminService';
import type { AdminStats } from '../types/admin';

// ─── Helpers ──────────────────────────────────────────────────────────────────

export type AdminTab = 'overview' | 'users' | 'orders' | 'complaints' | 'products' | 'audit';

export function formatETB(value: string | number): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  return `ETB ${n.toLocaleString('en-ET', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function statusBadge(status: string) {
  const map: Record<string, string> = {
    ACTIVE: 'admin-badge badge-active',
    SUSPENDED: 'admin-badge badge-suspended',
    DEACTIVATED: 'admin-badge badge-deactivated',
    PENDING: 'admin-badge badge-pending',
    CONFIRMED: 'admin-badge badge-confirmed',
    PREPARING: 'admin-badge badge-preparing',
    READY: 'admin-badge badge-ready',
    ACCEPTED: 'admin-badge badge-confirmed',
    COMPLETED: 'admin-badge badge-completed',
    CANCELLED: 'admin-badge badge-cancelled',
    OPEN: 'admin-badge badge-pending',
    UNDER_REVIEW: 'admin-badge badge-preparing',
    RESOLVED: 'admin-badge badge-completed',
    REJECTED: 'admin-badge badge-cancelled',
    CLOSED: 'admin-badge badge-deactivated',
    LOW: 'admin-badge badge-confirmed',
    MEDIUM: 'admin-badge badge-preparing',
    HIGH: 'admin-badge badge-suspended',
    URGENT: 'admin-badge badge-cancelled',
  };
  return map[status] ?? 'admin-badge';
}

// ─── Overview panel ──────────────────────────────────────────────────────────

export function OverviewPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch((e) => setError(e.message ?? 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="admin-loading">Loading dashboard statistics…</p>;
  if (error) return <p className="admin-error">⚠ {error}</p>;
  if (!stats) return null;

  const kpis = [
    { label: 'Registered Users', value: stats.total_users, icon: '👥' },
    { label: 'Active Sellers', value: stats.total_sellers, icon: '🏪' },
    { label: 'Products Listed', value: stats.total_products, icon: '📦' },
    { label: 'Total Orders', value: stats.total_orders, icon: '🛒' },
    { label: 'Open Complaints', value: stats.total_complaints, icon: '📣' },
    { label: 'Marketplace Revenue', value: formatETB(stats.total_revenue_etb), icon: '💰' },
  ];

  return (
    <section aria-labelledby="admin-overview-heading">
      <h2 id="admin-overview-heading" className="admin-section-title">
        System Overview
      </h2>
      <div className="admin-kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="admin-kpi-card">
            <span className="admin-kpi-icon" aria-hidden="true">{k.icon}</span>
            <div>
              <div className="admin-kpi-value">{k.value}</div>
              <div className="admin-kpi-label">{k.label}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="admin-note">
        ℹ All figures are live from the database. Refresh the page to update.
      </p>
    </section>
  );
}

// ─── Main Admin Dashboard Shell ───────────────────────────────────────────────

export function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('overview');

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview',   label: 'Overview',    icon: '📊' },
    { id: 'users',      label: 'Users',       icon: '👥' },
    { id: 'orders',     label: 'Orders',      icon: '🛒' },
    { id: 'complaints', label: 'Complaints',  icon: '📣' },
    { id: 'products',   label: 'Inventory',   icon: '📦' },
    { id: 'audit',      label: 'Audit Trail', icon: '📋' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">🛡 Admin Dashboard</h1>
        <p className="admin-dashboard-subtitle">
          AAU Campus Market — Administrative Control Panel
        </p>
      </header>

      <nav className="admin-tab-nav" aria-label="Admin sections">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-tab-btn ${tab === t.id ? 'admin-tab-active' : ''}`}
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
          >
            <span aria-hidden="true">{t.icon}</span> {t.label}
          </button>
        ))}
      </nav>

      <div className="admin-tab-content">
        {tab === 'overview' && <OverviewPanel />}
      </div>
    </div>
  );
}
