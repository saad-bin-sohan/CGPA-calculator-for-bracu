import mongoose, { Schema, Document } from 'mongoose';

export type GradeInputMethod = 'letter' | 'points' | 'percentage';

export interface IEnrollment extends Document {
  course?: mongoose.Types.ObjectId;
  courseCode: string;
  courseTitle: string;
  credits: number;
  gradeLetter?: string;
  gradePoint: number;
  percentage?: number;
  inputMethod: GradeInputMethod;
  countsTowardsCGPA: boolean;
  countsTowardsCredits: boolean;
  createdAt: Date;
}

export interface ISemester extends Document {
  user: mongoose.Types.ObjectId;
  department?: mongoose.Types.ObjectId;
  termName: string;
  enrollments: IEnrollment[];
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    courseCode: { type: String, required: true },
    courseTitle: { type: String, required: true },
    credits: { type: Number, required: true },
    gradeLetter: { type: String },
    gradePoint: { type: Number, required: true, default: 0 },
    percentage: { type: Number },
    inputMethod: { type: String, enum: ['letter', 'points', 'percentage'], default: 'letter' },
    countsTowardsCGPA: { type: Boolean, default: true },
    countsTowardsCredits: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const SemesterSchema = new Schema<ISemester>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    termName: { type: String, required: true },
    enrollments: [EnrollmentSchema]
  },
  { timestamps: true }
);

export const Semester = mongoose.model<ISemester>('Semester', SemesterSchema);
