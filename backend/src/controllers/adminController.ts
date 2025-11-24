import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { signToken } from '../utils/jwt.js';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!env.adminEmail || !env.adminPassword) {
    return res.status(400).json({ message: 'Admin credentials not configured' });
  }
  if (email.toLowerCase() !== env.adminEmail.toLowerCase()) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const isHash = env.adminPassword.startsWith('$2');
  const valid = isHash ? await bcrypt.compare(password, env.adminPassword) : password === env.adminPassword;
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = signToken({ role: 'admin', adminEmail: env.adminEmail });
  res
    .cookie('token', token, { ...cookieOptions, secure: env.clientOrigin.startsWith('https') })
    .json({ token, admin: { email: env.adminEmail } });
};
