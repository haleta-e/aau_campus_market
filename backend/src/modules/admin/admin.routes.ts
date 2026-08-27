import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AdminController();

// All admin routes strictly require ADMIN role
router.use(authenticate, authorize('ADMIN'));

/**
 * GET /api/v1/admin/stats
 * Admin – System overview KPIs (users, sellers, products, orders, complaints, revenue)
 */
router.get('/stats', controller.getStats);

/**
 * GET /api/v1/admin/audit-logs
 * Admin – Paginated audit logs with actor and entity change history
 */
router.get('/audit-logs', controller.getAuditLogs);

/**
 * GET /api/v1/admin/users
 * Admin – List all registered users with role and seller store details
 */
router.get('/users', controller.getUsers);

/**
 * PATCH /api/v1/admin/users/:id/status
 * Admin – Update user status (ACTIVE, SUSPENDED, PENDING_VERIFICATION)
 */
router.patch('/users/:id/status', controller.updateUserStatus);

/**
 * GET /api/v1/admin/orders
 * Admin – Complete orders traceability (buyer, seller, price, accepted_at, status)
 */
router.get('/orders', controller.getOrders);

export default router;
