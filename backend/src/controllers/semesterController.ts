import { Request, Response } from 'express';
import { GradeScale, IGradeScale } from '../models/GradeScale.js';
import { Semester } from '../models/Semester.js';
import { Settings } from '../models/Settings.js';
import { computeCGPA } from '../services/gpaCalculator.js';
import { Course } from '../models/Course.js';

const resolveGradePoint = (entry: any, gradeScale: IGradeScale[]): { gradePoint: number; gradeLetter?: string } => {
  if (entry.inputMethod === 'points') {
    return { gradePoint: Number(entry.gradePoint), gradeLetter: entry.gradeLetter };
  }
  if (entry.inputMethod === 'letter' && entry.gradeLetter) {
    const found = gradeScale.find((g) => g.letter.toUpperCase() === entry.gradeLetter.toUpperCase());
    return { gradePoint: found ? found.gradePoint : 0, gradeLetter: entry.gradeLetter.toUpperCase() };
  }
  if (entry.inputMethod === 'percentage' && entry.percentage !== undefined) {
    const found = gradeScale.find(
      (g) =>
        !g.isSpecial &&
        entry.percentage >= g.minPercentage &&
        entry.percentage <= g.maxPercentage
    );
    if (found) return { gradePoint: found.gradePoint, gradeLetter: found.letter };
  }
  return { gradePoint: 0, gradeLetter: entry.gradeLetter };
};

const normalizeEnrollments = async (enrollments: any[]) => {
  const gradeScale = await GradeScale.find({});
  const settings = (await Settings.findOne({})) || (await Settings.create({}));
  const coursesMap = new Map<string, any>();
  return Promise.all(
    enrollments.map(async (entry) => {
      if (entry.course && !coursesMap.has(entry.course)) {
        const c = await Course.findById(entry.course);
        if (c) coursesMap.set(entry.course, c);
      }
      const course = entry.course ? coursesMap.get(entry.course) : null;
      const { gradePoint, gradeLetter } = resolveGradePoint(entry, gradeScale);
      const countsTowardsCGPA =
        entry.countsTowardsCGPA !== undefined
          ? entry.countsTowardsCGPA
          : course
          ? course.countsTowardsCGPA
          : true;
      const countsTowardsCredits =
        entry.countsTowardsCredits !== undefined
          ? entry.countsTowardsCredits
          : course
          ? course.countsTowardsCredits
          : true;
      const isLab = course?.category === 'Lab';
      return {
        course: entry.course,
        courseCode: course ? course.code : entry.courseCode,
        courseTitle: course ? course.title : entry.courseTitle,
        credits: course ? course.credits : entry.credits,
        gradeLetter: gradeLetter || entry.gradeLetter,
        gradePoint,
        percentage: entry.percentage,
        inputMethod: entry.inputMethod || 'letter',
        countsTowardsCGPA: isLab ? settings.labCountsTowardsCGPA : countsTowardsCGPA,
        countsTowardsCredits: isLab ? settings.labCountsTowardsCredits : countsTowardsCredits
      };
    })
  );
};

export const getSemesters = async (req: Request, res: Response) => {
  const semesters = await Semester.find({ user: req.user!.id }).sort({ createdAt: 1 });
  const settings = (await Settings.findOne({})) || (await Settings.create({}));
  const calcInput = semesters.map((sem) => ({
    termName: sem.termName,
    enrollments: sem.enrollments.map((e) => ({
      courseCode: e.courseCode,
      gradePoint: e.gradePoint,
      credits: e.credits,
      countsTowardsCGPA: e.countsTowardsCGPA,
      countsTowardsCredits: e.countsTowardsCredits,
      createdAt: e.createdAt
    }))
  }));
  const summary = computeCGPA(calcInput, settings.cgpaPrecision);
  res.json({ semesters, summary });
};

export const createSemester = async (req: Request, res: Response) => {
  const { termName, department, enrollments = [] } = req.body;
  const normalizedEnrollments = await normalizeEnrollments(enrollments);
  const semester = await Semester.create({
    user: req.user!.id,
    termName,
    department,
    enrollments: normalizedEnrollments
  });
  res.status(201).json({ semester });
};

export const updateSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { termName, enrollments = [], department } = req.body;
  const normalizedEnrollments = await normalizeEnrollments(enrollments);
  const semester = await Semester.findOneAndUpdate(
    { _id: id, user: req.user!.id },
    { termName, enrollments: normalizedEnrollments, department },
    { new: true }
  );
  if (!semester) return res.status(404).json({ message: 'Semester not found' });
  res.json({ semester });
};

export const deleteSemester = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Semester.findOneAndDelete({ _id: id, user: req.user!.id });
  res.status(204).send();
};
