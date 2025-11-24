import { Request, Response } from 'express';
import { SemesterTemplate } from '../models/SemesterTemplate.js';

export const listTemplates = async (req: Request, res: Response) => {
  const { department } = req.query;
  const filters: any = {};
  if (department) filters.department = department;
  const templates = await SemesterTemplate.find(filters).populate('courses');
  res.json({ templates });
};

export const createTemplate = async (req: Request, res: Response) => {
  const template = await SemesterTemplate.create(req.body);
  res.status(201).json({ template });
};

export const updateTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const template = await SemesterTemplate.findByIdAndUpdate(id, req.body, { new: true });
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json({ template });
};

export const deleteTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  await SemesterTemplate.findByIdAndDelete(id);
  res.status(204).send();
};
