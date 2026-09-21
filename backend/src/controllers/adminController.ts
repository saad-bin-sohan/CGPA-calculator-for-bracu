import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { env } from '../config/env.js';
import { AUTH_COOKIE_NAME, buildAuthCookieOptions } from '../utils/cookies.js';
import { signToken } from '../utils/jwt.js';

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!env.adminEmail || !env.adminPassword) {
    return res.status(400).json({ message: 'Admin credentials not configured' });
  }
  if (email.toLowerCase() !== env.adminEmail.toLowerCase()) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const isHash = env.adminPassword.startsWith('$2');
  const valid = isHash
    ? // eslint-disable-next-line import/no-named-as-default-member -- bcryptjs's own documented usage
      await bcrypt.compare(password, env.adminPassword)
    : password === env.adminPassword;
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken({ role: 'admin', adminEmail: env.adminEmail });
  res
    .cookie(AUTH_COOKIE_NAME, token, buildAuthCookieOptions(req.secure))
    .json({ token, admin: { email: env.adminEmail } });
};
