import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import gradeScaleRoutes from './routes/gradeScaleRoutes.js';
import semesterRoutes from './routes/semesterRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import { seedDefaults } from './utils/seed.js';

const app = express();

// Render (and most PaaS hosts) terminate TLS at a proxy in front of this
// process and forward plain HTTP internally. Without this, req.secure is
// always false, which would make the auth cookie logic below think every
// request is insecure even in production. This makes req.secure reflect the
// original client connection via the X-Forwarded-Proto header.
app.set('trust proxy', 1);

app.use(
  cors({
    origin(requestOrigin, callback) {
      // Requests with no Origin header (server-to-server calls, curl,
      // health checks) aren't subject to CORS - let them through.
      if (!requestOrigin) return callback(null, true);
      const normalized = requestOrigin.replace(/\/+$/, '');
      if (env.clientOrigins.includes(normalized)) {
        return callback(null, true);
      }
      console.warn(`Blocked CORS request from unrecognized origin: ${requestOrigin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
// eslint-disable-next-line import/no-named-as-default-member -- Express's own documented usage
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

// Express identifies error-handling middleware by checking that the handler
// function has exactly 4 parameters - removing the unused `_next` here would
// silently change this into a regular (3-arg) middleware and Express would
// stop treating it as the error handler.
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
);

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
