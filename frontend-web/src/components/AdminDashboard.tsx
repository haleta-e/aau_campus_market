import { useState, useEffect, useCallback } from 'react';
import { getAdminStats, getAdminUsers, updateUserStatus, getAdminOrders } from '../services/adminService';
import type { AdminStats, AdminUser, AdminOrder } from '../types/admin';

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

// ─── Users panel ─────────────────────────────────────────────────────────────

export function UsersPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getAdminUsers()
      .then(setUsers)
      .catch((e) => setError(e.message ?? 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED') => {
    setUpdating(userId);
    setActionError(null);
    try {
      const updated = await updateUserStatus(userId, { status: newStatus });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, status: updated.status } : u)));
    } catch (e: any) {
      setActionError(e.message ?? 'Status update failed');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = users.filter((u) => {
    if (filterRole && u.role !== filterRole) return false;
    if (filterStatus && u.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <section aria-labelledby="admin-users-heading">
      <h2 id="admin-users-heading" className="admin-section-title">User Management</h2>
      {actionError && <p className="admin-error">⚠ {actionError}</p>}
      <div className="admin-filter-bar">
        <input
          type="search"
          placeholder="Search username or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input"
          aria-label="Search users"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="admin-select"
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admin</option>
          <option value="SELLER">Seller</option>
          <option value="BUYER">Buyer</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-select"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="DEACTIVATED">Deactivated</option>
        </select>
        <button className="admin-btn admin-btn-secondary" onClick={load} aria-label="Refresh users">
          ↻ Refresh
        </button>
      </div>
      {loading ? (
        <p className="admin-loading">Loading users…</p>
      ) : error ? (
        <p className="admin-error">⚠ {error}</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table" aria-label="Registered users">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Store</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="admin-empty-row">No users match the filter.</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td><span className={statusBadge(u.role)}>{u.role}</span></td>
                    <td>{u.store_name ?? '—'}</td>
                    <td><span className={statusBadge(u.status)}>{u.status}</span></td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      {u.role === 'ADMIN' ? (
                        <span className="admin-muted">Protected</span>
                      ) : updating === u.id ? (
                        <span className="admin-muted">Saving…</span>
                      ) : (
                        <div className="admin-action-group">
                          {u.status !== 'ACTIVE' && (
                            <button
                              className="admin-btn admin-btn-sm admin-btn-success"
                              onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                            >
                              Activate
                            </button>
                          )}
                          {u.status === 'ACTIVE' && (
                            <button
                              className="admin-btn admin-btn-sm admin-btn-warning"
                              onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                            >
                              Suspend
                            </button>
                          )}
                          {u.status !== 'DEACTIVATED' && (
                            <button
                              className="admin-btn admin-btn-sm admin-btn-danger"
                              onClick={() => handleStatusChange(u.id, 'DEACTIVATED')}
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <p className="admin-count">{filtered.length} user(s) shown of {users.length} total</p>
        </div>
      )}
    </section>
  );
}


// ─── Orders panel ─────────────────────────────────────────────────────────────

export function OrdersPanel() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    getAdminOrders()
      .then(setOrders)
      .catch((e) => setError(e.message ?? 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

  const statusOptions = ['PENDING','CONFIRMED','PREPARING','READY','ACCEPTED','COMPLETED','CANCELLED'];

  return (
    <section aria-labelledby="admin-orders-heading">
      <h2 id="admin-orders-heading" className="admin-section-title">Order Monitoring</h2>
      <div className="admin-filter-bar">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="admin-select"
          aria-label="Filter by order status"
        >
          <option value="">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="admin-loading">Loading orders…</p>
      ) : error ? (
        <p className="admin-error">⚠ {error}</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table" aria-label="All orders">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Buyer</th>
                <th>Store</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total (ETB)</th>
                <th>Placed</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="admin-empty-row">No orders found.</td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="admin-mono">{o.order_number}</td>
                    <td>{o.buyer_username ?? o.buyer_email ?? '—'}</td>
                    <td>{o.store_name ?? '—'}</td>
                    <td><span className={statusBadge(o.status)}>{o.status}</span></td>
                    <td><span className={statusBadge(o.payment_status)}>{o.payment_status}</span></td>
                    <td>{formatETB(o.total_amount)}</td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>{o.completed_at ? new Date(o.completed_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <p className="admin-count">{filtered.length} order(s) shown of {orders.length} total</p>
        </div>
      )}
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
        {tab === 'users'    && <UsersPanel />}
        {tab === 'orders'   && <OrdersPanel />}
      </div>
    </div>
  );
}
