import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import { checkDatabaseHealth } from './db';
import path from 'path';
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/products/product.routes';
import orderRoutes from './modules/orders/order.routes';
import paymentRoutes from './modules/payments/payment.routes';
import complaintRoutes from './modules/complaints/complaint.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Swagger Documentation UI
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base Health & Readiness Endpoints
app.get('/health', async (req: Request, res: Response) => {
  const dbHealthy = await checkDatabaseHealth();
  if (dbHealthy) {
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        server: 'up',
      },
    });
  } else {
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        server: 'up',
      },
    });
  }
});

app.get('/ready', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
  });
});

// API Root endpoint
app.get('/api/v1', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    version: 'v1',
    message: 'AAU Campus Market Production API v1 is active',
    documentation: '/api/v1/docs',
  });
});

// ─── API v1 Module Routes ───────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/admin', adminRoutes);

// ─── Admin Web Dashboard Static Files ──────────────────────────────────────
const publicPath = path.join(__dirname, '../public');
app.get(['/admin', '/admin/', '/admin/login', '/admin/dashboard'], (req: Request, res: Response) => {
  res.sendFile(path.join(publicPath, 'admin', 'index.html'));
});
app.use(express.static(publicPath));

// 404 Route Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected server error occurred',
  });
});

export default app;
