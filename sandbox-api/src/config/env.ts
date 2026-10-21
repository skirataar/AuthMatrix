import dotenv from 'dotenv';
import path from 'path';

// Load .env relative to sandbox-api root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export type SecurityMode = 'vulnerable' | 'patched';

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  DEFAULT_SECURITY_MODE: (process.env.DEFAULT_SECURITY_MODE === 'patched' ? 'patched' : 'vulnerable') as SecurityMode,
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-for-sandbox-development-mode',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
};
