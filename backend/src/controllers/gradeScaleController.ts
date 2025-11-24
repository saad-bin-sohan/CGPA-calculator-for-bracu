import { Request, Response } from 'express';
import { GradeScale } from '../models/GradeScale.js';

export const listGradeScale = async (_req: Request, res: Response) => {
  const entries = await GradeScale.find({}).sort({ minPercentage: -1 });
  res.json({ entries });
};

export const createGradeEntry = async (req: Request, res: Response) => {
  const entry = await GradeScale.create(req.body);
  res.status(201).json({ entry });
};

export const updateGradeEntry = async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await GradeScale.findByIdAndUpdate(id, req.body, { new: true });
  if (!entry) return res.status(404).json({ message: 'Entry not found' });
  res.json({ entry });
};

export const deleteGradeEntry = async (req: Request, res: Response) => {
  const { id } = req.params;
  await GradeScale.findByIdAndDelete(id);
  res.status(204).send();
};
