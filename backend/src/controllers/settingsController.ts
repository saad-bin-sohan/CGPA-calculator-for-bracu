import { Request, Response } from 'express';
import { Settings } from '../models/Settings.js';

const getSingleton = async () => {
  const existing = await Settings.findOne({});
  if (existing) return existing;
  return Settings.create({});
};

export const getSettings = async (_req: Request, res: Response) => {
  const settings = await getSingleton();
  res.json({ settings });
};

export const updateSettings = async (req: Request, res: Response) => {
  const settings = await getSingleton();
  Object.assign(settings, req.body);
  await settings.save();
  res.json({ settings });
};
