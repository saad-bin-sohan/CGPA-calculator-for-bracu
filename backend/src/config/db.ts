import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDb = async (): Promise<void> => {
  if (!env.mongoUri) {
    throw new Error('MONGO_URI not set');
  }
  await mongoose.connect(env.mongoUri);
  // We rely on mongoose default connection events for logs handled in index.ts
};
