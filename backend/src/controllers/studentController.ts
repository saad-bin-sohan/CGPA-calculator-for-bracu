import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Semester } from '../models/Semester.js';
import { Settings } from '../models/Settings.js';
import { computeCGPA } from '../services/gpaCalculator.js';

export const listStudents = async (_req: Request, res: Response) => {
  const students = await User.find({ role: 'student' }).populate('department').sort({ createdAt: -1 });
  res.json({ students });
};

export const getStudentProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const student = await User.findById(id).populate('department');
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const semesters = await Semester.find({ user: id }).sort({ createdAt: 1 });
  const settings = (await Settings.findOne({})) || (await Settings.create({}));
  const summary = computeCGPA(
    semesters.map((sem) => ({
      termName: sem.termName,
      enrollments: sem.enrollments.map((e) => ({
        courseCode: e.courseCode,
        gradePoint: e.gradePoint,
        credits: e.credits,
        countsTowardsCGPA: e.countsTowardsCGPA,
        countsTowardsCredits: e.countsTowardsCredits,
        createdAt: e.createdAt
      }))
    })),
    settings.cgpaPrecision
  );
  res.json({ student, semesters, summary });
};
