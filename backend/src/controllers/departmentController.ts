import { Request, Response } from 'express';
import { Course } from '../models/Course.js';
import { Department } from '../models/Department.js';

export const getDepartments = async (_req: Request, res: Response) => {
  // { $ne: false } (rather than { active: true }) also matches documents
  // where `active` is simply absent - e.g. records created before this field
  // existed on the schema. An exact { active: true } match silently excludes
  // those forever, since Mongoose's schema `default` only applies to newly
  // constructed documents, never retroactively to ones already in the
  // database. Explicit `active: false` (soft-deleted) is still excluded.
  const departments = await Department.find({ active: { $ne: false } });
  res.json({ departments });
};

export const createDepartment = async (req: Request, res: Response) => {
  const { name, code, totalCreditsRequired } = req.body;
  const department = await Department.create({ name, code, totalCreditsRequired });
  res.status(201).json({ department });
};

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const department = await Department.findByIdAndUpdate(id, req.body, { new: true });
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
