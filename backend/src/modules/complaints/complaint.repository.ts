import { db, pool } from '../../db';
import {
  complaints,
  complaint_messages,
  orders,
  users,
  sellers,
  audit_logs,
  Complaint,
  NewComplaint,
  ComplaintMessage,
  NewComplaintMessage,
} from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

export class ComplaintRepository {
  async findOrderById(orderId: string) {
    const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    return result[0];
  }

  async findSellerByUserId(userId: string) {
    const result = await db.select().from(sellers).where(eq(sellers.user_id, userId)).limit(1);
    return result[0];
  }

  async findComplaintById(id: string) {
    const result = await db
      .select({
        id: complaints.id,
        complaint_number: complaints.complaint_number,
        order_id: complaints.order_id,
        buyer_id: complaints.buyer_id,
        seller_id: complaints.seller_id,
        admin_id: complaints.admin_id,
        subject: complaints.subject,
        description: complaints.description,
        status: complaints.status,
        priority: complaints.priority,
        resolution: complaints.resolution,
        created_at: complaints.created_at,
        updated_at: complaints.updated_at,
        resolved_at: complaints.resolved_at,
        buyer_email: users.email,
        buyer_username: users.username,
        store_name: sellers.store_name,
        order_number: orders.order_number,
      })
      .from(complaints)
      .leftJoin(users, eq(complaints.buyer_id, users.id))
      .leftJoin(sellers, eq(complaints.seller_id, sellers.id))
      .leftJoin(orders, eq(complaints.order_id, orders.id))
      .where(eq(complaints.id, id))
      .limit(1);
    return result[0];
  }

  async findMessagesByComplaintId(complaintId: string) {
    return db
      .select({
        id: complaint_messages.id,
        complaint_id: complaint_messages.complaint_id,
        sender_id: complaint_messages.sender_id,
        message: complaint_messages.message,
        created_at: complaint_messages.created_at,
        sender_email: users.email,
        sender_role: users.role,
        sender_username: users.username,
      })
      .from(complaint_messages)
      .leftJoin(users, eq(complaint_messages.sender_id, users.id))
      .where(eq(complaint_messages.complaint_id, complaintId))
      .orderBy(sql`${complaint_messages.created_at} ASC`);
  }

  async findComplaintsByBuyer(buyerId: string) {
    return db
      .select({
        id: complaints.id,
        complaint_number: complaints.complaint_number,
        order_id: complaints.order_id,
        subject: complaints.subject,
        status: complaints.status,
        priority: complaints.priority,
        created_at: complaints.created_at,
        resolved_at: complaints.resolved_at,
      })
      .from(complaints)
      .where(eq(complaints.buyer_id, buyerId))
      .orderBy(sql`${complaints.created_at} DESC`);
  }

  async findComplaintsBySeller(sellerId: string) {
    return db
      .select({
        id: complaints.id,
        complaint_number: complaints.complaint_number,
        order_id: complaints.order_id,
        subject: complaints.subject,
        status: complaints.status,
        priority: complaints.priority,
        created_at: complaints.created_at,
        resolved_at: complaints.resolved_at,
      })
      .from(complaints)
      .where(eq(complaints.seller_id, sellerId))
      .orderBy(sql`${complaints.created_at} DESC`);
  }

  async findAllComplaints() {
    return db
      .select({
        id: complaints.id,
        complaint_number: complaints.complaint_number,
        order_id: complaints.order_id,
        subject: complaints.subject,
        status: complaints.status,
        priority: complaints.priority,
        created_at: complaints.created_at,
        resolved_at: complaints.resolved_at,
        buyer_username: users.username,
        store_name: sellers.store_name,
      })
      .from(complaints)
      .leftJoin(users, eq(complaints.buyer_id, users.id))
      .leftJoin(sellers, eq(complaints.seller_id, sellers.id))
      .orderBy(sql`${complaints.created_at} DESC`);
  }

  async createComplaint(data: NewComplaint): Promise<Complaint> {
    const [created] = await db.insert(complaints).values(data).returning();
    return created;
  }

  async addMessage(data: NewComplaintMessage): Promise<ComplaintMessage> {
    const [created] = await db.insert(complaint_messages).values(data).returning();
    return created;
  }

  async resolveComplaint(
    id: string,
    adminId: string,
    status: 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | 'CLOSED',
    resolution: string
  ): Promise<Complaint | undefined> {
    const isTerminal = status === 'RESOLVED' || status === 'REJECTED' || status === 'CLOSED';
    const [updated] = await db
      .update(complaints)
      .set({
        admin_id: adminId,
        status,
        resolution,
        updated_at: new Date(),
        resolved_at: isTerminal ? new Date() : null,
      })
      .where(eq(complaints.id, id))
      .returning();
    return updated;
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

  async generateComplaintNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM complaints WHERE complaint_number LIKE $1`,
      [`CMP-${year}-%`]
    );
    const seq = String(parseInt(rows[0].cnt, 10) + 1).padStart(4, '0');
    return `CMP-${year}-${seq}`;
  }
}
