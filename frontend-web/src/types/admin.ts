// ─── Admin Type Definitions ───────────────────────────────────────────────────
// Derived strictly from backend admin.repository.ts, admin.schema.ts,
// complaint.schema.ts, and the DB schema.

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

/** Order record returned by GET /api/v1/admin/orders */
export interface AdminOrder {
  id: string;
  order_number: string;
  buyer_id: string;
  buyer_username: string | null;
  buyer_email: string | null;
  seller_id: string;
  store_name: string | null;
  status:
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'READY'
    | 'ACCEPTED'
    | 'COMPLETED'
    | 'CANCELLED';
  payment_status: string;
  total_amount: string;
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
}

/** Audit log entry returned by GET /api/v1/admin/audit-logs */
export interface AuditLogEntry {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: unknown | null;
  new_value: unknown | null;
  ip_address: string | null;
  created_at: string;
  actor_email: string | null;
  actor_role: string | null;
  actor_username: string | null;
}

export interface AuditLogsResponse {
  rows: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

/** Complaint record returned by GET /api/v1/complaints/admin */
export interface AdminComplaint {
  id: string;
  complaint_number: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  admin_id: string | null;
  subject: string;
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  resolution: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  // Joined fields (from complaint.repository joins)
  buyer_username?: string | null;
  order_number?: string | null;
}

/** Payload for PATCH /api/v1/complaints/:id/resolve */
export interface ResolveComplaintPayload {
  status: 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'CLOSED';
  resolution: string;
}
