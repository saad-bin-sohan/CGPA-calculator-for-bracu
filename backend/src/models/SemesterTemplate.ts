import mongoose, { Schema, Document } from 'mongoose';

export interface ISemesterTemplate extends Document {
  department: mongoose.Types.ObjectId;
  termName: string;
  courses: mongoose.Types.ObjectId[];
  active: boolean;
}

const SemesterTemplateSchema = new Schema<ISemesterTemplate>(
  {
    department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    termName: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

SemesterTemplateSchema.index({ department: 1, termName: 1 }, { unique: true });

export const SemesterTemplate = mongoose.model<ISemesterTemplate>(
  'SemesterTemplate',
  SemesterTemplateSchema
);
