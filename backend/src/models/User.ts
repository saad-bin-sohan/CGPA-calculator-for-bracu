import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'student' | 'admin';
export type AuthProvider = 'local' | 'google';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  authProvider: AuthProvider;
  role: UserRole;
  department?: mongoose.Types.ObjectId;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    googleId: { type: String }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
