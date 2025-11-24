import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import gradeScaleRoutes from './routes/gradeScaleRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import semesterRoutes from './routes/semesterRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import { seedDefaults } from './utils/seed.js';

const app = express();
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/departments', departmentRoutes);
app.use('/courses', courseRoutes);
app.use('/grade-scale', gradeScaleRoutes);
app.use('/settings', settingsRoutes);
app.use('/semesters', semesterRoutes);
app.use('/students', studentRoutes);
app.use('/templates', templateRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const start = async () => {
  await connectDb();
  await seedDefaults();
  app.listen(env.port, () => {
    console.log(`API listening on ${env.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
