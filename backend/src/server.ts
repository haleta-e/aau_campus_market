import app from './app';
import { env } from './config/env';
import { pool } from './db';

const PORT = env.PORT;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AAU Campus Market Backend running on http://0.0.0.0:${PORT}`);
  console.log(`📚 Swagger API Docs available at http://localhost:${PORT}/api/v1/docs`);
});

// Graceful Shutdown
const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('HTTP Server closed.');
    try {
      await pool.end();
      console.log('PostgreSQL Connection Pool closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing database pool:', err);
      process.exit(1);
    }
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
