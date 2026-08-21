const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'aau_campus_market_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AAU Campus Market API is running',
  });
});

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

let server;

// Start Server if run directly
if (require.main === module) {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });

  // Graceful Shutdown
  const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    if (server) {
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await pool.end();
          console.log('PostgreSQL connection pool closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error closing PostgreSQL pool:', err);
          process.exit(1);
        }
      });
    }
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

module.exports = { app, pool };
