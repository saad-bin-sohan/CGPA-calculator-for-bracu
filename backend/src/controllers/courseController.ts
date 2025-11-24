import { Request, Response } from 'express';
import { Course } from '../models/Course.js';

export const listCourses = async (req: Request, res: Response) => {
  const { department, category, active } = req.query;
  const filters: any = {};
  if (department) filters.departments = department;
  if (category) filters.category = category;
  if (active !== undefined) filters.active = active === 'true';
  const courses = await Course.find(filters).limit(200);
  res.json({ courses });
};

export const searchCourses = async (req: Request, res: Response) => {
  const { query = '', department } = req.query as { query?: string; department?: string };
  const filters: any = { active: true };
  if (department) filters.departments = department;
  if (query) filters.code = { $regex: query, $options: 'i' };
  const courses = await Course.find(filters).limit(20);
  res.json({ courses });
};

export const createCourse = async (req: Request, res: Response) => {
  const { code, title, credits, category, departments, countsTowardsCGPA, countsTowardsCredits, active } =
    req.body;
  const existing = await Course.findOne({ code: code.toUpperCase() });
  if (existing) return res.status(400).json({ message: 'Course code already exists' });
  const course = await Course.create({
    code: code.toUpperCase(),
    title,
    credits,
    category,
    departments,
    countsTowardsCGPA,
    countsTowardsCredits,
    active
  });
  res.status(201).json({ course });
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json({ course });
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Course.findByIdAndDelete(id);
  res.status(204).send();
};
