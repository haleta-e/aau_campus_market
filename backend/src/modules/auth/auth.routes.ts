import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

/**
 * POST /api/v1/auth/register
 * Public – Register a new buyer account
 */
router.post('/register', controller.register);

/**
 * POST /api/v1/auth/login
 * Public – Authenticate with username/email and password, receive JWT + refresh token
 */
router.post('/login', controller.login);

/**
 * POST /api/v1/auth/refresh-token
 * Public – Rotate refresh token and receive new access token
 */
router.post('/refresh-token', controller.refreshToken);

/**
 * POST /api/v1/auth/logout
 * Protected – Revoke refresh token and invalidate session
 */
router.post('/logout', authenticate, controller.logout);

/**
 * GET /api/v1/auth/me
 * Protected – Get current authenticated user profile
 */
router.get('/me', authenticate, controller.getMe);

export default router;
