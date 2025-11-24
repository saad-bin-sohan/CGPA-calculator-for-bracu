import mongoose, { Schema, Document } from 'mongoose';

export type CourseCategory = 'Core' | 'Elective' | 'Major' | 'Minor' | 'Lab' | 'GED';

export interface ICourse extends Document {
  code: string;
  title: string;
  credits: number;
  category: CourseCategory;
  departments: mongoose.Types.ObjectId[];
  countsTowardsCGPA: boolean;
  countsTowardsCredits: boolean;
  active: boolean;
}

const CourseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    title: { type: String, required: true },
    credits: { type: Number, default: 3 },
    category: {
      type: String,
      enum: ['Core', 'Elective', 'Major', 'Minor', 'Lab', 'GED'],
      default: 'Core'
    },
    departments: [{ type: Schema.Types.ObjectId, ref: 'Department' }],
    countsTowardsCGPA: { type: Boolean, default: true },
    countsTowardsCredits: { type: Boolean, default: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
