import mongoose, { Schema, Document } from 'mongoose';

export interface IGradeScale extends Document {
  letter: string;
  minPercentage: number;
  maxPercentage: number;
  gradePoint: number;
  isSpecial: boolean;
}

const GradeScaleSchema = new Schema<IGradeScale>(
  {
    letter: { type: String, required: true, uppercase: true },
    minPercentage: { type: Number, required: true },
    maxPercentage: { type: Number, required: true },
    gradePoint: { type: Number, required: true },
    isSpecial: { type: Boolean, default: false }
  },
  { timestamps: true }
);

GradeScaleSchema.index({ letter: 1 }, { unique: true });

export const GradeScale = mongoose.model<IGradeScale>('GradeScale', GradeScaleSchema);
