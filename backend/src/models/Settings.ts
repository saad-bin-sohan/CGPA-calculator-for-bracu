import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  cgpaPrecision: number;
  labCountsTowardsCGPA: boolean;
  labCountsTowardsCredits: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    cgpaPrecision: { type: Number, default: 10 },
    labCountsTowardsCGPA: { type: Boolean, default: false },
    labCountsTowardsCredits: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
