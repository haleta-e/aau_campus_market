import { db, pool } from '../../db';
import {
  users,
  sellers,
  products,
  orders,
  transactions,
  complaints,
  audit_logs,
} from '../../db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { AuditLogsQueryDTO } from './admin.schema';

export class AdminRepository {
  async getSystemStats() {
    const [usersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [sellersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(sellers);
    const [productsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
    const [ordersCount] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
    const [complaintsCount] = await db.select({ count: sql<number>`count(*)::int` }).from(complaints);
    const [revenue] = await db
      .select({ total: sql<string>`coalesce(sum(amount), 0)::text` })
      .from(transactions)
      .where(eq(transactions.status, 'SUCCESS'));

    return {
      total_users: usersCount?.count || 0,
      total_sellers: sellersCount?.count || 0,
      total_products: productsCount?.count || 0,
      total_orders: ordersCount?.count || 0,
      total_complaints: complaintsCount?.count || 0,
      total_revenue_etb: revenue?.total || '0.00',
    };
  }

  async getAuditLogs(query: AuditLogsQueryDTO) {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const offset = (page - 1) * limit;

    const rows = await db
      .select({
        id: audit_logs.id,
        actor_id: audit_logs.actor_id,
        action: audit_logs.action,
        entity_type: audit_logs.entity_type,
        entity_id: audit_logs.entity_id,
        old_value: audit_logs.old_value,
        new_value: audit_logs.new_value,
        ip_address: audit_logs.ip_address,
        created_at: audit_logs.created_at,
        actor_email: users.email,
        actor_role: users.role,
        actor_username: users.username,
      })
      .from(audit_logs)
      .leftJoin(users, eq(audit_logs.actor_id, users.id))
      .orderBy(desc(audit_logs.created_at))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(audit_logs);

    return {
      rows,
      total: count,
      page,
      limit,
    };
  }

  async getAllUsers() {
    return db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
        status: users.status,
        created_at: users.created_at,
        store_name: sellers.store_name,
      })
      .from(users)
      .leftJoin(sellers, eq(users.id, sellers.user_id))
      .orderBy(desc(users.created_at));
  }

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED') {
    const [updated] = await db
      .update(users)
      .set({ status, updated_at: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async getAllOrders() {
    return db
      .select({
        id: orders.id,
        order_number: orders.order_number,
        buyer_id: orders.buyer_id,
        buyer_username: users.username,
        buyer_email: users.email,
        seller_id: orders.seller_id,
        store_name: sellers.store_name,
        status: orders.status,
        payment_status: orders.payment_status,
        total_amount: orders.total_amount,
        created_at: orders.created_at,
        accepted_at: orders.accepted_at,
        completed_at: orders.completed_at,
      })
      .from(orders)
      .leftJoin(users, eq(orders.buyer_id, users.id))
      .leftJoin(sellers, eq(orders.seller_id, sellers.id))
      .orderBy(desc(orders.created_at));
  }

  async createAuditLog(log: {
    actor_id?: string;
    action: string;
    entity_type: string;
    entity_id?: string;
    old_value?: any;
    new_value?: any;
    ip_address?: string;
  }) {
    await db.insert(audit_logs).values(log);
  }
}
