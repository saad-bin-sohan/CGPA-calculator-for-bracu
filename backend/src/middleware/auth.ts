import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';

export interface AuthPayload {
  userId?: string;
  role: 'student' | 'admin';
  adminEmail?: string;
}

const getTokenFromRequest = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.substring(7);
  }
  if (req.cookies?.token) {
    return req.cookies.token as string;
  }
  return null;
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, env.jwtSecret) as AuthPayload;
    if (decoded.role === 'student' && decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = { id: user.id, role: user.role };
    } else if (decoded.role === 'admin') {
      req.user = { id: decoded.adminEmail || 'admin', role: 'admin' };
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

export const requireStudent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ message: 'Students only' });
  }
  next();
};
