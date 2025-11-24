# BRACU CGPA Calculator & Graduation Tracker

Full-stack web app for BRAC University students to calculate CGPA/semester GPA, plan retakes, and track graduation credits. Includes guest calculator, student dashboard, and admin console.

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript + MongoDB (Mongoose)
- Auth: JWT (httpOnly cookies), optional Google OAuth, admin login via env credentials

## Quick start
1. **Backend**
   ```bash
   cd backend
   cp .env.example .env   # fill values
   npm install
   npm run dev
   ```
   - Default API port: `4000`
   - Seeds departments, grade scale (with W/I), and settings on startup.

2. **Frontend**
   ```bash
   cd frontend
   cp .env.example .env.local   # point NEXT_PUBLIC_API_BASE to backend
   npm install
   npm run dev
   ```
   - Default dev server: `http://localhost:3000`

## Deployment notes
- **Backend on Render**: use a Web Service, set `npm run build` then `npm start`; add env vars (`PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `GOOGLE_CLIENT_ID`).
- **MongoDB**: MongoDB Atlas or Render Mongo add-on.
- **Frontend**: Render static/site or Vercel; set `NEXT_PUBLIC_API_BASE` to the deployed backend URL with https; enable CORS origin on backend (`CLIENT_ORIGIN`).

## Project structure
- `frontend/` – Next.js app routes under `/app`, shared UI components, GPA calculator client logic, PDF export.
- `backend/` – Express API, Mongoose models, GPA calculator service, admin/student routes, seed data.

See sub-folder READMEs for route maps, environment details, and feature specifics.
