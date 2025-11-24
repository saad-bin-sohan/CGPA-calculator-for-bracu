# Backend – BRACU CGPA API

Express + TypeScript API for CGPA calculation, semesters, and admin management.

## Setup
```bash
cd backend
npm install
cp .env.example .env   # fill values
npm run dev            # hot reload with ts-node-dev
```

## Env vars
- `PORT` – API port (default 4000)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – JWT signing secret
- `CLIENT_ORIGIN` – frontend origin for CORS (e.g., http://localhost:3000)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` – admin login; `ADMIN_PASSWORD` may be plain or bcrypt hash
- `GOOGLE_CLIENT_ID` – Google OAuth client ID (optional)

## Key models
- `User` (student/local or google)
- `Department`, `Course`
- `GradeScale` (letter ↔ percentage ↔ grade point; includes W/I)
- `Settings` (CGPA precision, lab counting flags)
- `Semester` with `enrollments` (grade input mode, retake-aware)
- `SemesterTemplate` (for future defaults)

## GPA rules implemented
- CGPA/SGPA = sum(gradePoint * credits) / sum(credits) with configurable precision (default 10)
- Retakes: last attempt per course code wins across semesters
- W/I allowed with grade points controlled by grade scale
- Lab inclusion controlled by Settings

## Routes (REST)
- `POST /auth/register`, `POST /auth/login`, `POST /auth/google`, `GET /auth/me`, `PUT /auth/profile`
- `POST /admin/login`
- `GET /departments` (+ admin CRUD)
- `GET /courses`, `GET /courses/search?query=...` (+ admin CRUD)
- `GET /grade-scale` (+ admin CRUD)
- `GET /settings`, `PUT /settings` (admin)
- `GET /semesters`, `POST /semesters`, `PUT /semesters/:id`, `DELETE /semesters/:id` (student)
- `GET /students`, `GET /students/:id` (admin)
- `GET/POST/PUT/DELETE /templates` (admin)

Auth: JWT stored in `token` httpOnly cookie; admin token includes `role: 'admin'`.

## Deployment on Render
- Web Service, build `npm run build`, start `npm start`.
- Set env vars (above) and `CLIENT_ORIGIN` to your frontend URL; enable "Allow credentials" CORS.

## Seeding
On startup seeds default departments (CSE, CS, EEE, ENH, PHR, ARC, BBA, MNS, LAW), BRACU grade scale with W/I entries, and default settings.
