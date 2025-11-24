import { Department } from '../models/Department.js';
import { GradeScale } from '../models/GradeScale.js';
import { Settings } from '../models/Settings.js';

export const seedDefaults = async (): Promise<void> => {
  const departments = [
    { name: 'Computer Science and Engineering', code: 'CSE', totalCreditsRequired: 136 },
    { name: 'Computer Science', code: 'CS', totalCreditsRequired: 124 },
    { name: 'Electrical and Electronic Engineering', code: 'EEE', totalCreditsRequired: 136 },
    { name: 'English and Humanities', code: 'ENH', totalCreditsRequired: 128 },
    { name: 'Pharmacy', code: 'PHR', totalCreditsRequired: 132 },
    { name: 'Architecture', code: 'ARC', totalCreditsRequired: 120 },
    { name: 'Business Administration', code: 'BBA', totalCreditsRequired: 132 },
    { name: 'Mathematics and Natural Sciences', code: 'MNS', totalCreditsRequired: 132 },
    { name: 'Law', code: 'LAW', totalCreditsRequired: 134 }
  ];
  for (const d of departments) {
    const exists = await Department.findOne({ code: d.code });
    if (!exists) await Department.create(d);
  }

  const gradeScaleCount = await GradeScale.countDocuments();
  if (gradeScaleCount === 0) {
    const entries = [
      { letter: 'A+', minPercentage: 97, maxPercentage: 100, gradePoint: 4.0 },
      { letter: 'A', minPercentage: 90, maxPercentage: 96, gradePoint: 4.0 },
      { letter: 'A-', minPercentage: 85, maxPercentage: 89.99, gradePoint: 3.7 },
      { letter: 'B+', minPercentage: 80, maxPercentage: 84.99, gradePoint: 3.3 },
      { letter: 'B', minPercentage: 75, maxPercentage: 79.99, gradePoint: 3.0 },
      { letter: 'B-', minPercentage: 70, maxPercentage: 74.99, gradePoint: 2.7 },
      { letter: 'C+', minPercentage: 65, maxPercentage: 69.99, gradePoint: 2.3 },
      { letter: 'C', minPercentage: 60, maxPercentage: 64.99, gradePoint: 2.0 },
      { letter: 'C-', minPercentage: 57, maxPercentage: 59.99, gradePoint: 1.7 },
      { letter: 'D+', minPercentage: 55, maxPercentage: 56.99, gradePoint: 1.3 },
      { letter: 'D', minPercentage: 52, maxPercentage: 54.99, gradePoint: 1.0 },
      { letter: 'D-', minPercentage: 50, maxPercentage: 51.99, gradePoint: 0.7 },
      { letter: 'F', minPercentage: 0, maxPercentage: 49.99, gradePoint: 0 },
      { letter: 'W', minPercentage: 0, maxPercentage: 100, gradePoint: 0, isSpecial: true },
      { letter: 'I', minPercentage: 0, maxPercentage: 100, gradePoint: 0, isSpecial: true }
    ];
    await GradeScale.insertMany(entries);
  }

  const settings = await Settings.findOne({});
  if (!settings) {
    await Settings.create({});
  }
};
