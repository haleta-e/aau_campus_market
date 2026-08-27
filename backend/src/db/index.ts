import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client pool', err);
});

export const db = drizzle(pool);

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const res = await pool.query('SELECT 1 AS alive');
    return res.rows[0]?.alive === 1;
  } catch (error) {
    console.error('Database healthcheck failed:', error);
    return false;
  }
};
