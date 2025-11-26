import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

const googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : null;

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, department } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    authProvider: 'local',
    role: 'student',
    department
  });
  const token = signToken({ userId: user.id, role: 'student' });
  res
    .cookie('token', token, { ...cookieOptions, secure: env.clientOrigin.startsWith('https') })
    .json({ user: sanitizeUser(user), token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.passwordHash) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = signToken({ userId: user.id, role: 'student' });
  res
    .cookie('token', token, { ...cookieOptions, secure: env.clientOrigin.startsWith('https') })
    .json({ user: sanitizeUser(user), token });
};

export const googleLogin = async (req: Request, res: Response) => {
  const { idToken } = req.body;
  if (!googleClient) {
    return res.status(400).json({ message: 'Google OAuth not configured' });
  }
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    return res.status(400).json({ message: 'Invalid Google token' });
  }
  const email = payload.email.toLowerCase();
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: payload.name || email,
      email,
      authProvider: 'google',
      role: 'student',
      googleId: payload.sub
    });
  }
  const token = signToken({ userId: user.id, role: 'student' });
  res
    .cookie('token', token, { ...cookieOptions, secure: env.clientOrigin.startsWith('https') })
    .json({ user: sanitizeUser(user), token });
};

export const me = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).populate('department');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user: sanitizeUser(user) });
};

export const updateProfile = async (req: Request, res: Response) => {
  const { name, department } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { name, department },
    { new: true }
  ).populate('department');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: sanitizeUser(user) });
};

export const logout = async (_req: Request, res: Response) => {
  res
    .clearCookie('token', { ...cookieOptions, secure: env.clientOrigin.startsWith('https') })
    .json({ message: 'Logged out' });
};

const sanitizeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  department: user.department
});
