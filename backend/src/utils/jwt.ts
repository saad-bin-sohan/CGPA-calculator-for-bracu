import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthPayload } from '../middleware/auth.js';

export const signToken = (payload: AuthPayload, expiresIn = '7d'): string => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
};
