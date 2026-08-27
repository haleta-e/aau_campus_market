import { Router } from 'express';
import { ProductController } from './product.controller';
import { authenticate, authorize } from '../../middleware/auth.middleware';

const router = Router();
const controller = new ProductController();

/**
 * GET /api/v1/products
 * Public – List all active products with optional filters (category, search, seller_id)
 */
router.get('/', controller.list);

/**
 * GET /api/v1/products/:id
 * Public – Get a single product by ID with seller info
 */
router.get('/:id', controller.getOne);

/**
 * POST /api/v1/products
 * Protected (SELLER only) – Create a new product listing
 */
router.post('/', authenticate, authorize('SELLER'), controller.create);

/**
 * PATCH /api/v1/products/:id
 * Protected (SELLER or ADMIN) – Update product details or stock
 */
router.patch('/:id', authenticate, authorize('SELLER', 'ADMIN'), controller.update);

/**
 * DELETE /api/v1/products/:id
 * Protected (SELLER or ADMIN) – Soft-deactivate a product listing
 */
router.delete('/:id', authenticate, authorize('SELLER', 'ADMIN'), controller.remove);

export default router;
