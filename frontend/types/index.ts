export type CourseCategory = 'Core' | 'Elective' | 'Major' | 'Minor' | 'Lab' | 'GED';

export interface Department {
  _id: string;
  name: string;
  code: string;
  totalCreditsRequired: number;
}

export interface Course {
  _id: string;
  code: string;
  title: string;
  credits: number;
  category: CourseCategory;
  departments: string[];
  countsTowardsCGPA: boolean;
  countsTowardsCredits: boolean;
  active: boolean;
}

export interface GradeScaleEntry {
  _id: string;
  letter: string;
  minPercentage: number;
  maxPercentage: number;
  gradePoint: number;
  isSpecial?: boolean;
}

export interface Settings {
  _id: string;
  cgpaPrecision: number;
  labCountsTowardsCGPA: boolean;
  labCountsTowardsCredits: boolean;
}

export type GradeInputMethod = 'letter' | 'points' | 'percentage';

export interface EnrollmentInput {
  course?: string;
  courseCode: string;
  courseTitle: string;
  credits: number;
  gradeLetter?: string;
  gradePoint: number;
  percentage?: number;
  inputMethod: GradeInputMethod;
  countsTowardsCGPA: boolean;
  countsTowardsCredits: boolean;
  createdAt?: string;
}

export interface Semester {
  _id?: string;
  termName: string;
  department?: string;
  enrollments: EnrollmentInput[];
}

export interface Summary {
  cgpa: number;
  totalCredits: number;
  totalCourses: number;
  perSemester: { termName: string; gpa: number; credits: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student';
  department?: Department;
}

export interface SemesterTemplate {
  _id: string;
  termName: string;
  department: Department | string;
  courses: Course[];
}
