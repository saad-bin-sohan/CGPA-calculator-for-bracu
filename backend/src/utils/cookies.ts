import type { CookieOptions } from 'express';

/**
 * Centralized auth cookie configuration.
 *
 * Why this file exists: the frontend (Vercel) and backend (Render) are
 * deployed on two different domains. That makes every request between them
 * "cross-site" as far as the browser is concerned, even though they're the
 * same product. Cross-site `fetch()` calls only carry a cookie if it was set
 * with `SameSite=None; Secure` — anything else (including the previous
 * `SameSite=Lax`) is silently withheld by the browser, which is why users
 * were appearing logged out immediately after a successful login.
 *
 * `secureConnection` should be the actual, per-request connection security
 * (Express's `req.secure`), not a guess derived from an env var string. That
 * way this works correctly in both contexts without any manual toggling:
 *  - Local dev over plain HTTP (frontend/backend both on localhost): treated
 *    as same-site by browsers regardless of port, so `Lax` + non-`Secure`
 *    works and doesn't require HTTPS locally.
 *  - Production over HTTPS (Vercel <-> Render): cross-site, so it needs
 *    `None` + `Secure`, which this returns automatically once the request is
 *    detected as secure.
 *
 * For `req.secure` to be accurate behind Render's reverse proxy, the app
 * must also call `app.set('trust proxy', 1)` once at startup (done in
 * `index.ts`) so Express honors the `X-Forwarded-Proto` header instead of
 * seeing the proxy's internal plain-HTTP hop.
 */
export const AUTH_COOKIE_NAME = 'token';

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const buildAuthCookieOptions = (secureConnection: boolean): CookieOptions => ({
  httpOnly: true,
  sameSite: secureConnection ? 'none' : 'lax',
  secure: secureConnection,
  path: '/',
  maxAge: MAX_AGE_MS
});
