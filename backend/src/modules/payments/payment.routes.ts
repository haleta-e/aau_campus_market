import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const controller = new PaymentController();

router.use(authenticate);

/**
 * POST /api/v1/payments/process
 * Protected (BUYER only) – Process payment for an order
 */
router.post('/process', authorize('BUYER'), controller.processPayment);

/**
 * GET /api/v1/payments/my
 * Protected (BUYER only) – List current buyer's payments
 */
router.get('/my', authorize('BUYER'), controller.getMyPayments);

/**
 * GET /api/v1/payments/:id
 * Protected (BUYER, SELLER, ADMIN) – Get transaction details
 */
router.get('/:id', authorize('BUYER', 'SELLER', 'ADMIN'), controller.getTransaction);

export default router;
