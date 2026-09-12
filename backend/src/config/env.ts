import dotenv from 'dotenv';

dotenv.config();

/**
 * CLIENT_ORIGIN may contain one URL or a comma-separated list (useful when
 * you have a production frontend URL and a preview/staging one). Each entry
 * is trimmed and has any trailing slash stripped, since a browser's `Origin`
 * header never includes a trailing slash and a mismatch there would silently
 * break CORS for anyone who copy-pasted the URL with one.
 */
const parseOrigins = (raw: string): string[] =>
  raw
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean);

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'changeme',
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGIN || 'http://localhost:3000'),
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || ''
};
