# Frontend – BRACU CGPA Calculator

Next.js 14 (App Router) + TypeScript + Tailwind. Includes guest calculator, student dashboard, and admin screens.

## Setup
```bash
cd frontend
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE to backend origin
npm run dev
```

## Pages
- `/` Home/landing
- `/calculator` Guest CGPA calculator (local state, PDF export)
- `/login`, `/signup`
- `/dashboard` Student dashboard (persistent semesters)
- `/profile` Update name/department
- `/admin/login`
- `/admin` Admin overview
- `/admin/departments`, `/admin/courses`, `/admin/grade-scale`, `/admin/students`, `/admin/templates`, `/admin/settings`

## Design notes
- Tailwind for layout; responsive accordion semesters with live GPA/CGPA.
- Grade entry supports letter, points, or percentage; maps to grade points using backend grade scale (W/I editable).
- Templates: admin defines semester templates per department; guest/student calculators can apply them and still edit.
- Guest calculator persists locally (localStorage); student dashboard persists via API and respects retake rule (latest attempt per course).
- PDF export via `html2canvas` + `jsPDF`.

## Config
- `NEXT_PUBLIC_API_BASE` – backend URL (default http://localhost:4000)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` – for Google OAuth button wiring (backend must be configured too).

## Development tips
- All API calls use `fetch` with credentials to keep httpOnly JWT cookies.
- Client-side GPA logic mirrors backend (retake-aware).
- Update lint/format via `npm run lint`.
