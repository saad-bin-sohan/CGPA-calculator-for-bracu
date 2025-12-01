import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthPayload } from '../middleware/auth.js';

const DEFAULT_EXPIRES_IN: SignOptions['expiresIn'] = '7d';

export const signToken = (
  payload: AuthPayload,
  expiresIn: SignOptions['expiresIn'] = DEFAULT_EXPIRES_IN
): string => {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.sign(payload, env.jwtSecret, { expiresIn });
};
