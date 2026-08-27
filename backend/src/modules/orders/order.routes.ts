import { Router } from 'express';
import { OrderController } from './order.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const controller = new OrderController();

// All order routes require authentication
router.use(authenticate);

/**
 * POST /api/v1/orders
 * BUYER – Place a new order (atomic transaction with stock deduction)
 */
router.post('/', authorize('BUYER'), controller.placeOrder);

/**
 * GET /api/v1/orders/my
 * BUYER – List all orders placed by the authenticated buyer
 */
router.get('/my', authorize('BUYER'), controller.getMyOrders);

/**
 * GET /api/v1/orders/seller
 * SELLER – List all incoming orders for the seller's store
 */
router.get('/seller', authorize('SELLER'), controller.getSellerOrders);

/**
 * GET /api/v1/orders/:id
 * BUYER | SELLER | ADMIN – Get full order detail with line items
 */
router.get('/:id', authorize('BUYER', 'SELLER', 'ADMIN'), controller.getOrderDetail);

/**
 * PATCH /api/v1/orders/:id/status
 * SELLER | ADMIN – Update order status (CONFIRMED → PREPARING → READY → CANCELLED)
 */
router.patch('/:id/status', authorize('SELLER', 'ADMIN'), controller.updateStatus);

/**
 * POST /api/v1/orders/:id/accept
 * BUYER – Confirm receipt of order (records accepted_at timestamp)
 */
router.post('/:id/accept', authorize('BUYER'), controller.acceptOrder);

export default router;
