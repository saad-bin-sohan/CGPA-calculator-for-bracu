'use client';

import { useEffect, useMemo, useState } from 'react';
import SemesterAccordion from '../../components/SemesterAccordion';
import ProgressBar from '../../components/ProgressBar';
import SummaryCard from '../../components/SummaryCard';
import { api } from '../../lib/api';
import { computeSummary } from '../../lib/gpa';
import { Course, Department, GradeScaleEntry, Semester } from '../../types';
import { exportElementToPDF } from '../../utils/pdf';

export default function DashboardPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeScaleEntry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [precision, setPrecision] = useState<number>(10);
  const [userDept, setUserDept] = useState<Department | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [deptRes, gradeRes, settingsRes, meRes, semRes] = await Promise.all([
          api.getDepartments(),
          api.getGradeScale(),
          api.getSettings(),
          api.me().catch(() => null),
          api.semesters.list().catch(() => ({ semesters: [], summary: null }))
        ]);
        setDepartments(deptRes.departments || []);
        setGradeScale(gradeRes.entries || []);
        setPrecision(settingsRes.settings?.cgpaPrecision || 10);
        if (meRes?.department) setUserDept(meRes.department as Department);
        setSemesters(semRes.semesters || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard. Please login again.');
      }
    };
    load();
  }, []);

  const summary = useMemo(() => computeSummary(semesters, precision), [semesters, precision]);
  const requiredCredits = userDept?.totalCreditsRequired || 136;

  const updateSemester = (idx: number, next: Semester) => {
    const clone = [...semesters];
    clone[idx] = next;
    setSemesters(clone);
  };

  const addSemester = () => {
    setSemesters([...semesters, { termName: `Semester ${semesters.length + 1}`, enrollments: [] }]);
  };

  const removeSemester = async (idx: number) => {
    const sem = semesters[idx];
    if (sem._id) {
      await api.semesters.delete(sem._id);
    }
    setSemesters(semesters.filter((_, i) => i !== idx));
  };

  const searchCourses = async (query: string) => {
    if (query.length < 2) return;
    const res = await api.getCourses(query);
    setCourses(res.courses || []);
  };

  const saveSemester = async (sem: Semester) => {
    if (sem._id) {
      await api.semesters.update(sem._id, sem);
    } else {
      const created = await api.semesters.create(sem);
      sem._id = created.semester._id;
    }
  };

  const saveAll = async () => {
    setMessage(null);
    for (const sem of semesters) {
      await saveSemester(sem);
    }
    setMessage('Semesters saved');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-slate-600">
            Manage your semesters, track CGPA, and monitor graduation progress.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => exportElementToPDF('dashboard-area', 'cgpa-plan.pdf')}
          >
            Export as PDF
          </button>
          <button
            className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white"
            onClick={saveAll}
          >
            Save all
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      <div className="card grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="CGPA"
          value={summary.cgpa.toFixed(Math.min(precision, 10))}
          sub={`${summary.totalCourses} unique courses`}
        />
        <SummaryCard title="Completed credits" value={`${summary.totalCredits}`} />
        <SummaryCard
          title="Department"
          value={userDept ? `${userDept.name} (${userDept.code})` : 'Not set'}
          sub={`Credits required: ${requiredCredits}`}
        />
      </div>
      <ProgressBar completed={summary.totalCredits} total={requiredCredits} />
      <div id="dashboard-area" className="space-y-4">
        {semesters.map((sem, idx) => (
          <div key={sem._id || idx} className="space-y-2">
            <SemesterAccordion
              semester={sem}
              onChange={(next) => updateSemester(idx, next)}
              onRemove={() => removeSemester(idx)}
              gradeScale={gradeScale}
              courseOptions={courses}
              onCourseSearch={searchCourses}
              precision={precision}
            />
            <button
              className="text-xs font-semibold text-primary"
              onClick={() => saveSemester(sem)}
            >
              Save semester
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addSemester}
        className="rounded-md border border-dashed border-primary px-4 py-2 text-sm font-semibold text-primary"
      >
        + Add semester
      </button>
    </div>
  );
}
