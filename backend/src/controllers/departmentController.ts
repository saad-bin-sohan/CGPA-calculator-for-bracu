import { Request, Response } from 'express';
import { Department } from '../models/Department.js';
import { Course } from '../models/Course.js';

export const getDepartments = async (_req: Request, res: Response) => {
  const departments = await Department.find({ active: true });
  res.json({ departments });
};

export const createDepartment = async (req: Request, res: Response) => {
  const { name, code, totalCreditsRequired } = req.body;
  const department = await Department.create({ name, code, totalCreditsRequired });
  res.status(201).json({ department });
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const department = await Department.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );
  if (!department) return res.status(404).json({ message: 'Department not found' });
  res.json({ department });
};

export const deleteDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const inUse = await Course.findOne({ departments: id });
  if (inUse) {
    return res.status(400).json({ message: 'Department used by courses' });
  }
  await Department.findByIdAndDelete(id);
  res.status(204).send();
};
