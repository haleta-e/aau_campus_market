import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'testing', 'test', 'production']).default('development'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432').transform((val) => parseInt(val, 10)),
  DB_NAME: z.string().default('aau_campus_market_db'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres_secure_password'),
  JWT_SECRET: z.string().default('aau_campus_market_access_token_secret_key_2026_prod'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().default('aau_campus_market_refresh_token_secret_key_2026_prod'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment configuration:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
