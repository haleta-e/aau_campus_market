import crypto from 'crypto';
import { PaymentRepository } from './payment.repository';
import { ProcessPaymentDTO } from './payment.schema';
import { JwtPayload } from '../../utils/jwt.util';

export class PaymentService {
  private repo = new PaymentRepository();

  async processPayment(dto: ProcessPaymentDTO, actor: JwtPayload, ipAddress?: string) {
    const order = await this.repo.findOrderById(dto.order_id);
    if (!order) {
      throw { status: 404, code: 'ORDER_NOT_FOUND', message: 'Order not found' };
    }

    if (order.buyer_id !== actor.userId) {
      throw { status: 403, code: 'FORBIDDEN', message: 'You can only pay for your own orders' };
    }

    if (order.payment_status === 'SUCCESS') {
      throw { status: 409, code: 'ALREADY_PAID', message: 'This order has already been paid for' };
    }

    if (order.status === 'CANCELLED') {
      throw { status: 409, code: 'ORDER_CANCELLED', message: 'Cannot pay for a cancelled order' };
    }

    // Generate unique payment transaction reference (e.g. TXN-YYYY-HEX)
    const reference = `TXN-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Mock payment always succeeds in this simulated campus environment
    const transaction = await this.repo.createTransactionAtomic({
      order_id: order.id,
      buyer_id: order.buyer_id,
      seller_id: order.seller_id,
      amount: order.total_amount,
      payment_method: dto.payment_method,
      status: 'SUCCESS',
      reference,
    });

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'PAYMENT_PROCESSED',
      entity_type: 'TRANSACTION',
      entity_id: transaction.id,
      new_value: {
        order_id: order.id,
        amount: order.total_amount,
        reference,
        payment_method: dto.payment_method,
      },
      ip_address: ipAddress,
    });

    return transaction;
  }

  async getTransaction(id: string, actor: JwtPayload) {
    const tx = await this.repo.findTransactionById(id);
    if (!tx) {
      throw { status: 404, code: 'TRANSACTION_NOT_FOUND', message: 'Transaction not found' };
    }

    if (actor.role === 'BUYER' && tx.buyer_id !== actor.userId) {
      throw { status: 403, code: 'FORBIDDEN', message: 'You cannot view this transaction' };
    }

    return tx;
  }

  async getMyTransactions(actor: JwtPayload) {
    return this.repo.findTransactionsByBuyer(actor.userId);
  }
}
