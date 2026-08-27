import { db, pool } from '../../db';
import {
  orders,
  order_items,
  products,
  sellers,
  users,
  audit_logs,
  Order,
  NewOrder,
  NewOrderItem,
} from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { UpdateOrderStatusDTO } from './order.schema';

export class OrderRepository {
  // ─── Lookup helpers ────────────────────────────────────────────────────────

  async findOrderById(id: string) {
    const result = await db
      .select({
        id: orders.id,
        order_number: orders.order_number,
        buyer_id: orders.buyer_id,
        seller_id: orders.seller_id,
        status: orders.status,
        total_amount: orders.total_amount,
        payment_status: orders.payment_status,
        created_at: orders.created_at,
        updated_at: orders.updated_at,
        accepted_at: orders.accepted_at,
        completed_at: orders.completed_at,
        buyer_username: users.username,
        buyer_email: users.email,
        store_name: sellers.store_name,
        campus_location: sellers.campus_location,
      })
      .from(orders)
      .leftJoin(users, eq(orders.buyer_id, users.id))
      .leftJoin(sellers, eq(orders.seller_id, sellers.id))
      .where(eq(orders.id, id))
      .limit(1);
    return result[0];
  }

  async findOrderItemsByOrderId(orderId: string) {
    return db
      .select({
        id: order_items.id,
        product_id: order_items.product_id,
        quantity: order_items.quantity,
        unit_price: order_items.unit_price,
        subtotal: order_items.subtotal,
        product_name: products.name,
        product_category: products.category,
      })
      .from(order_items)
      .leftJoin(products, eq(order_items.product_id, products.id))
      .where(eq(order_items.order_id, orderId));
  }

  async findOrdersByBuyer(buyerId: string) {
    return db
      .select()
      .from(orders)
      .where(eq(orders.buyer_id, buyerId))
      .orderBy(sql`${orders.created_at} DESC`);
  }

  async findOrdersBySeller(sellerId: string) {
    return db
      .select()
      .from(orders)
      .where(eq(orders.seller_id, sellerId))
      .orderBy(sql`${orders.created_at} DESC`);
  }

  async findSellerByUserId(userId: string) {
    const result = await db.select().from(sellers).where(eq(sellers.user_id, userId)).limit(1);
    return result[0];
  }

  async findProductById(productId: string) {
    const result = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    return result[0];
  }

  // ─── Atomic order creation with stock protection ───────────────────────────

  async createOrderAtomic(
    orderData: NewOrder,
    lineItems: Array<{ product_id: string; quantity: number; unit_price: number }>
  ) {
    // Use a raw pg client for full transaction control
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Insert the order header
      const { rows: orderRows } = await client.query(
        `INSERT INTO orders (order_number, buyer_id, seller_id, status, total_amount, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          orderData.order_number,
          orderData.buyer_id,
          orderData.seller_id,
          orderData.status ?? 'PENDING',
          orderData.total_amount,
          orderData.payment_status ?? 'PENDING',
        ]
      );
      const newOrder = orderRows[0];

      // For each item: atomically deduct stock only if sufficient quantity exists
      for (const item of lineItems) {
        const subtotal = (item.unit_price * item.quantity).toFixed(2);

        // Race-condition-safe stock deduction — fails if stock is insufficient
        const { rows: deductRows } = await client.query(
          `UPDATE products
           SET stock_quantity = stock_quantity - $1, updated_at = NOW()
           WHERE id = $2 AND stock_quantity >= $1 AND status = 'ACTIVE'
           RETURNING id, stock_quantity`,
          [item.quantity, item.product_id]
        );

        if (deductRows.length === 0) {
          throw {
            status: 409,
            code: 'INSUFFICIENT_STOCK',
            message: `Insufficient stock for product ${item.product_id}`,
          };
        }

        // Store historical unit_price at time of purchase
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5)`,
          [newOrder.id, item.product_id, item.quantity, item.unit_price.toFixed(2), subtotal]
        );
      }

      await client.query('COMMIT');
      return newOrder as Order;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ─── Status transitions ─────────────────────────────────────────────────────

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status: status as any, updated_at: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  async acceptOrder(id: string): Promise<Order | undefined> {
    const now = new Date();
    const [updated] = await db
      .update(orders)
      .set({ status: 'ACCEPTED', accepted_at: now, updated_at: now })
      .where(and(eq(orders.id, id), eq(orders.payment_status, 'SUCCESS')))
      .returning();
    return updated;
  }

  async completeOrder(id: string): Promise<Order | undefined> {
    const now = new Date();
    const [updated] = await db
      .update(orders)
      .set({ status: 'COMPLETED', completed_at: now, updated_at: now })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }

  // ─── Audit ─────────────────────────────────────────────────────────────────

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

  // ─── Order number generator ─────────────────────────────────────────────────

  async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM orders WHERE order_number LIKE $1`,
      [`ORD-${year}-%`]
    );
    const seq = String(parseInt(rows[0].cnt, 10) + 1).padStart(4, '0');
    return `ORD-${year}-${seq}`;
  }
}
