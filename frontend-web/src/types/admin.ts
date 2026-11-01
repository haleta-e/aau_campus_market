// ─── Admin Type Definitions ───────────────────────────────────────────────────
// Derived strictly from backend admin.repository.ts, admin.schema.ts,
// and database schema.

/** System-wide KPI statistics returned by GET /api/v1/admin/stats */
export interface AdminStats {
  total_users: number;
  total_sellers: number;
  total_products: number;
  total_orders: number;
  total_complaints: number;
  /** Stored as string (NUMERIC from Postgres coalesce/text cast) */
  total_revenue_etb: string;
}

/** User record returned by GET /api/v1/admin/users */
export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: 'ADMIN' | 'SELLER' | 'BUYER';
  /** User account status — matches users.status enum in DB */
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  created_at: string;
  /** Null if the user is not a SELLER */
  store_name: string | null;
}

/** Payload for PATCH /api/v1/admin/users/:id/status */
export interface UpdateUserStatusPayload {
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
}
