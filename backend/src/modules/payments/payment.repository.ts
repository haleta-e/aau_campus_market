import { db, pool } from '../../db';
import {
  transactions,
  orders,
  users,
  sellers,
  audit_logs,
  Transaction,
  NewTransaction,
} from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

export class PaymentRepository {
  async findOrderById(orderId: string) {
    const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    return result[0];
  }

  async findTransactionById(id: string) {
    const result = await db
      .select({
        id: transactions.id,
        order_id: transactions.order_id,
        buyer_id: transactions.buyer_id,
        seller_id: transactions.seller_id,
        amount: transactions.amount,
        payment_method: transactions.payment_method,
        status: transactions.status,
        reference: transactions.reference,
        created_at: transactions.created_at,
        updated_at: transactions.updated_at,
        buyer_email: users.email,
        store_name: sellers.store_name,
        order_number: orders.order_number,
      })
      .from(transactions)
      .leftJoin(users, eq(transactions.buyer_id, users.id))
      .leftJoin(sellers, eq(transactions.seller_id, sellers.id))
      .leftJoin(orders, eq(transactions.order_id, orders.id))
      .where(eq(transactions.id, id))
      .limit(1);
    return result[0];
  }

  async findTransactionsByBuyer(buyerId: string) {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.buyer_id, buyerId))
      .orderBy(sql`${transactions.created_at} DESC`);
  }

  async createTransactionAtomic(
    data: {
      order_id: string;
      buyer_id: string;
      seller_id: string;
      amount: string;
      payment_method: 'CASH' | 'CBE' | 'TELEBIRR' | 'MOCK_PAYMENT';
      status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED';
      reference: string;
    }
  ) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: txRows } = await client.query(
        `INSERT INTO transactions (order_id, buyer_id, seller_id, amount, payment_method, status, reference)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.order_id,
          data.buyer_id,
          data.seller_id,
          data.amount,
          data.payment_method,
          data.status,
          data.reference,
        ]
      );
      const newTx = txRows[0];

      if (data.status === 'SUCCESS') {
        await client.query(
          `UPDATE orders
           SET payment_status = 'SUCCESS', updated_at = NOW()
           WHERE id = $1`,
          [data.order_id]
        );
      }

      await client.query('COMMIT');
      return newTx as Transaction;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
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
