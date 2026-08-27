import { Router } from 'express';
import { ComplaintController } from './complaint.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const controller = new ComplaintController();

router.use(authenticate);

/**
 * POST /api/v1/complaints
 * Protected (BUYER only) – File a dispute against an order
 */
router.post('/', authorize('BUYER'), controller.fileComplaint);

/**
 * GET /api/v1/complaints/my
 * Protected (BUYER only) – List current buyer's complaints
 */
router.get('/my', authorize('BUYER'), controller.getMyComplaints);

/**
 * GET /api/v1/complaints/seller
 * Protected (SELLER only) – List complaints against current seller's store
 */
router.get('/seller', authorize('SELLER'), controller.getSellerComplaints);

/**
 * GET /api/v1/complaints/admin
 * Protected (ADMIN only) – List all disputes across system
 */
router.get('/admin', authorize('ADMIN'), controller.getAllComplaints);

/**
 * GET /api/v1/complaints/:id
 * Protected (BUYER, SELLER, ADMIN) – Get complaint details and full message thread
 */
router.get('/:id', authorize('BUYER', 'SELLER', 'ADMIN'), controller.getComplaintDetail);

/**
 * POST /api/v1/complaints/:id/messages
 * Protected (BUYER, SELLER, ADMIN) – Post a message in the dispute thread
 */
router.post('/:id/messages', authorize('BUYER', 'SELLER', 'ADMIN'), controller.addMessage);

/**
 * PATCH /api/v1/complaints/:id/resolve
 * Protected (ADMIN only) – Review, resolve, or reject a dispute with notes
 */
router.patch('/:id/resolve', authorize('ADMIN'), controller.resolveComplaint);

export default router;
