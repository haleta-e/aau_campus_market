import { OrderRepository } from './order.repository';
import { CreateOrderDTO, UpdateOrderStatusDTO } from './order.schema';
import { JwtPayload } from '../../utils/jwt.util';

export class OrderService {
  private repo = new OrderRepository();

  // ─── BUYER: Place a new order ─────────────────────────────────────────────

  async placeOrder(dto: CreateOrderDTO, actor: JwtPayload, ipAddress?: string) {
    // Validate seller exists
    const sellerCheck = await this.repo.findSellerByUserId(actor.userId);
    // Buyers cannot be sellers in this call — just verify seller_id is valid by querying it
    // (seller_id is passed explicitly in body; find it by id)
    const { db: drizzle } = await import('../../db');
    const { sellers } = await import('../../db/schema');
    const { eq } = await import('drizzle-orm');
    const sellerRows = await drizzle.select().from(sellers).where(eq(sellers.id, dto.seller_id)).limit(1);
    if (!sellerRows[0]) {
      throw { status: 404, code: 'SELLER_NOT_FOUND', message: 'Seller not found' };
    }
    if (sellerRows[0].status !== 'ACTIVE') {
      throw { status: 409, code: 'SELLER_INACTIVE', message: 'Seller is not currently active' };
    }

    // Resolve products and lock-in current prices
    const lineItems: Array<{ product_id: string; quantity: number; unit_price: number }> = [];
    let totalAmount = 0;

    for (const item of dto.items) {
      const product = await this.repo.findProductById(item.product_id);
      if (!product) {
        throw { status: 404, code: 'PRODUCT_NOT_FOUND', message: `Product ${item.product_id} not found` };
      }
      if (product.status !== 'ACTIVE') {
        throw { status: 409, code: 'PRODUCT_INACTIVE', message: `Product "${product.name}" is not available` };
      }
      if (product.seller_id !== dto.seller_id) {
        throw {
          status: 400,
          code: 'SELLER_MISMATCH',
          message: `Product "${product.name}" does not belong to the specified seller`,
        };
      }
      if (product.stock_quantity < item.quantity) {
        throw {
          status: 409,
          code: 'INSUFFICIENT_STOCK',
          message: `Only ${product.stock_quantity} units of "${product.name}" available`,
        };
      }

      const unitPrice = parseFloat(product.price);
      lineItems.push({ product_id: item.product_id, quantity: item.quantity, unit_price: unitPrice });
      totalAmount += unitPrice * item.quantity;
    }

    const orderNumber = await this.repo.generateOrderNumber();

    // Execute atomic transaction: insert order + order_items + deduct stock
    const order = await this.repo.createOrderAtomic(
      {
        order_number: orderNumber,
        buyer_id: actor.userId,
        seller_id: dto.seller_id,
        total_amount: totalAmount.toFixed(2),
        status: 'PENDING',
        payment_status: 'PENDING',
      },
      lineItems
    );

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'BUYER_PLACED_ORDER',
      entity_type: 'ORDER',
      entity_id: order.id,
      new_value: { order_number: order.order_number, total: order.total_amount, items: lineItems.length },
      ip_address: ipAddress,
    });

    return order;
  }

  // ─── Get order with items ─────────────────────────────────────────────────

  async getOrderDetail(id: string, actor: JwtPayload) {
    const order = await this.repo.findOrderById(id);
    if (!order) {
      throw { status: 404, code: 'ORDER_NOT_FOUND', message: 'Order not found' };
    }

    // BUYER can only see their own orders; SELLER only orders to their store; ADMIN sees all
    if (actor.role === 'BUYER' && order.buyer_id !== actor.userId) {
      throw { status: 403, code: 'FORBIDDEN', message: 'You cannot view this order' };
    }
    if (actor.role === 'SELLER') {
      const seller = await this.repo.findSellerByUserId(actor.userId);
      if (!seller || order.seller_id !== seller.id) {
        throw { status: 403, code: 'FORBIDDEN', message: 'You cannot view this order' };
      }
    }

    const items = await this.repo.findOrderItemsByOrderId(id);
    return { ...order, items };
  }

  // ─── BUYER: List my orders ────────────────────────────────────────────────

  async getMyOrders(actor: JwtPayload) {
    return this.repo.findOrdersByBuyer(actor.userId);
  }

  // ─── SELLER: List incoming orders ────────────────────────────────────────

  async getSellerOrders(actor: JwtPayload) {
    const seller = await this.repo.findSellerByUserId(actor.userId);
    if (!seller) {
      throw { status: 403, code: 'NO_SELLER_PROFILE', message: 'No seller profile found' };
    }
    return this.repo.findOrdersBySeller(seller.id);
  }

  // ─── SELLER/ADMIN: Update order status ──────────────────────────────────

  async updateStatus(id: string, dto: UpdateOrderStatusDTO, actor: JwtPayload, ipAddress?: string) {
    const order = await this.repo.findOrderById(id);
    if (!order) {
      throw { status: 404, code: 'ORDER_NOT_FOUND', message: 'Order not found' };
    }

    if (actor.role === 'SELLER') {
      const seller = await this.repo.findSellerByUserId(actor.userId);
      if (!seller || order.seller_id !== seller.id) {
        throw { status: 403, code: 'FORBIDDEN', message: 'You cannot update this order' };
      }
    }

    // Prevent updating already terminal states
    if (['ACCEPTED', 'COMPLETED', 'CANCELLED'].includes(order.status)) {
      throw {
        status: 409,
        code: 'ORDER_TERMINAL',
        message: `Order is already in terminal state: ${order.status}`,
      };
    }

    const updated = await this.repo.updateOrderStatus(id, dto.status);

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'ORDER_STATUS_UPDATED',
      entity_type: 'ORDER',
      entity_id: id,
      old_value: { status: order.status },
      new_value: { status: dto.status },
      ip_address: ipAddress,
    });

    return updated;
  }

  // ─── BUYER: Accept order (confirm receipt) ────────────────────────────────

  async acceptOrder(id: string, actor: JwtPayload, ipAddress?: string) {
    const order = await this.repo.findOrderById(id);
    if (!order) {
      throw { status: 404, code: 'ORDER_NOT_FOUND', message: 'Order not found' };
    }
    if (order.buyer_id !== actor.userId) {
      throw { status: 403, code: 'FORBIDDEN', message: 'Only the buyer of this order can accept it' };
    }
    if (order.payment_status !== 'SUCCESS') {
      throw { status: 409, code: 'PAYMENT_REQUIRED', message: 'Order cannot be accepted before payment is confirmed' };
    }
    if (order.status === 'ACCEPTED' || order.status === 'COMPLETED') {
      throw { status: 409, code: 'ALREADY_ACCEPTED', message: 'Order has already been accepted' };
    }
    if (order.status === 'CANCELLED') {
      throw { status: 409, code: 'ORDER_CANCELLED', message: 'Cancelled orders cannot be accepted' };
    }

    const updated = await this.repo.acceptOrder(id);

    await this.repo.createAuditLog({
      actor_id: actor.userId,
      action: 'BUYER_ACCEPTED_ORDER',
      entity_type: 'ORDER',
      entity_id: id,
      new_value: { accepted_at: new Date().toISOString() },
      ip_address: ipAddress,
    });

    return updated;
  }
}
