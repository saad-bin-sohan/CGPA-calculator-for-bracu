'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileDown, Save, Sigma, Layers, TrendingUp, GraduationCap } from 'lucide-react';
import SemesterAccordion from '../../components/SemesterAccordion';
import ProgressBar from '../../components/ProgressBar';
import SummaryCard from '../../components/SummaryCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { api } from '../../lib/api';
import { computeSummary } from '../../lib/gpa';
import {
  Course,
  Department,
  GradeScaleEntry,
  Semester,
  EnrollmentInput,
  SemesterTemplate
} from '../../types';
import { exportElementToPDF } from '../../utils/pdf';

const blankEnrollment = (): EnrollmentInput => ({
  courseCode: '',
  courseTitle: '',
  credits: 3,
  gradePoint: 0,
  inputMethod: 'letter',
  countsTowardsCGPA: true,
  countsTowardsCredits: true,
  createdAt: new Date().toISOString()
});

export default function DashboardPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [gradeScale, setGradeScale] = useState<GradeScaleEntry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [precision, setPrecision] = useState<number>(10);
  const [userDept, setUserDept] = useState<Department | null>(null);
  const [userName, setUserName] = useState<string>('Student');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<SemesterTemplate[]>([]);
  const [status, setStatus] = useState<string | null>(null);

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

        if (meRes?.name) setUserName(meRes.name);

        if (meRes?.department) {
          setUserDept(meRes.department as Department);
          api.getTemplates((meRes.department as Department)._id).then((t) => {
            setTemplates(t.templates || []);
            if ((semRes.semesters || []).length === 0 && (t.templates || []).length > 0) {
              applyTemplate(t.templates || [], meRes.department?._id);
            }
          });
        }

        if ((semRes.semesters || []).length > 0) {
          setSemesters(semRes.semesters || []);
        } else {
          setSemesters([
            {
              termName: 'Semester 1',
              department: meRes?.department ? (meRes.department as Department)._id : undefined,
              enrollments: Array.from({ length: 4 }, () => blankEnrollment())
            }
          ]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard. Please log in again.');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!userDept) return;
    api.getTemplates(userDept._id).then((t) => setTemplates(t.templates || []));
  }, [userDept]);

  useEffect(() => {
    if (userDept && templates.length > 0 && semesters.length === 0) {
      applyTemplate(templates);
    }
  }, [templates, userDept, semesters.length]);

  const summary = useMemo(
    () => computeSummary(semesters, precision),
    [semesters, precision]
  );
  const requiredCredits = userDept?.totalCreditsRequired || 136;

  const gpaValues = summary.perSemester.map((s) => s.gpa);
  const gpaMin = gpaValues.length ? Math.min(...gpaValues) : 0;
  const gpaMax = gpaValues.length ? Math.max(...gpaValues) : 4;

  const trendLabel = (() => {
    if (summary.perSemester.length < 2) return 'Stable';
    const last = summary.perSemester[summary.perSemester.length - 1]?.gpa ?? 0;
    const prev = summary.perSemester[summary.perSemester.length - 2]?.gpa ?? 0;
    if (last > prev) return 'Up';
    if (last < prev) return 'Down';
    return 'Stable';
  })();

  const updateSemester = (idx: number, next: Semester) => {
    const clone = [...semesters];
    clone[idx] = next;
    setSemesters(clone);
  };

  const addSemester = () => {
    setSemesters([
      ...semesters,
      {
        termName: `Semester ${semesters.length + 1}`,
        department: userDept?._id,
        enrollments: Array.from({ length: 4 }, () => blankEnrollment())
      }
    ]);
  };

  const removeSemester = async (idx: number) => {
    const sem = semesters[idx];
    if (sem._id) await api.semesters.delete(sem._id);
    setSemesters(semesters.filter((_, i) => i !== idx));
  };

  const searchCourses = async (query: string) => {
    if (query.length < 2) return;
    const res = await api.getCourses(query, userDept?._id);
    setCourses(res.courses || []);
  };

  const saveSemester = async (sem: Semester) => {
    const payload = { ...sem, department: sem.department || userDept?._id };
    if (sem._id) {
      await api.semesters.update(sem._id, payload);
    } else {
      const created = await api.semesters.create(payload);
      sem._id = created.semester._id;
    }
  };

  const saveAll = async () => {
    setMessage(null);
    for (const sem of semesters) await saveSemester(sem);
    setMessage('All semesters saved.');
  };

  const applyTemplate = (tpls: SemesterTemplate[], deptId?: string) => {
    if (!tpls || tpls.length === 0) {
      setSemesters([
        {
          termName: 'Semester 1',
          enrollments: Array.from({ length: 4 }, () => blankEnrollment())
        }
      ]);
      return;
    }
    const mapped: Semester[] = tpls.map((t) => ({
      termName: t.termName,
      department: deptId || userDept?._id,
      enrollments: (t.courses || []).map((c: Course) => ({
        course: c._id,
        courseCode: c.code,
        courseTitle: c.title,
        credits: c.credits,
        gradePoint: 0,
        inputMethod: 'letter',
        countsTowardsCGPA: c.countsTowardsCGPA,
        countsTowardsCredits: c.countsTowardsCredits,
        createdAt: new Date().toISOString()
      }))
    }));
    setSemesters(mapped);
    setStatus('Template applied to your plan.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Welcome back, {userName}
          </p>
          <h1 className="mt-1 font-display text-3xl font-normal text-stone-900">
            Student Dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage semesters, track CGPA, and monitor graduation progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportElementToPDF('dashboard-area', 'cgpa-plan.pdf')}
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="primary" size="sm" onClick={saveAll}>
            <Save className="h-4 w-4" />
            Save all
          </Button>
        </div>
      </div>

      {error && <p className="alert-danger">{error}</p>}
      {message && <p className="text-sm font-semibold text-success-700">{message}</p>}
      {status && <p className="text-sm font-semibold text-success-700">{status}</p>}

      <div className="grid grid-cols-2 border-l border-t border-stone-200 bg-white lg:grid-cols-4">
        <div className="border-b border-r border-stone-200">
          <SummaryCard
            title="CGPA"
            value={summary.cgpa.toFixed(Math.min(precision, 10))}
            sub={`${summary.totalCourses} unique courses`}
            icon={<Sigma className="h-4 w-4" />}
          />
        </div>
        <div className="border-b border-r border-stone-200">
          <SummaryCard
            title="Credits earned"
            value={`${summary.totalCredits}`}
            sub={`Goal: ${requiredCredits}`}
            icon={<Layers className="h-4 w-4" />}
          />
        </div>
        <div className="border-b border-r border-stone-200">
          <SummaryCard
            title="Semesters"
            value={`${semesters.length}`}
            sub="Planned semesters"
            icon={<GraduationCap className="h-4 w-4" />}
          />
        </div>
        <div className="border-b border-r border-stone-200">
          <SummaryCard
            title="Trend"
            value={trendLabel}
            sub={`${summary.perSemester.length} semester(s) tracked`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>
      </div>

      {templates.length > 0 && (
        <div className="alert-info flex flex-wrap items-center justify-between gap-3">
          <span>
            {templates.length} template{templates.length > 1 ? 's' : ''} available for your
            department.
          </span>
          <button
            type="button"
            onClick={() => applyTemplate(templates)}
            className="text-xs font-semibold text-primary-800 underline-offset-2 hover:underline"
          >
            Apply template
          </button>
        </div>
      )}

      <ProgressBar completed={summary.totalCredits} total={requiredCredits} />

      <hr className="border-stone-200" />

      <div className="grid gap-10 lg:grid-cols-[1fr_260px] lg:items-start">
        <div>
          <div id="dashboard-area">
            {semesters.length === 0 ? (
              <EmptyState
                title="No semesters saved"
                description="Create your first semester and sync it to your account."
                actionLabel="Add first semester"
                onAction={addSemester}
              />
            ) : (
              <div className="divide-y divide-stone-200 border-y border-stone-200">
                {semesters.map((sem, idx) => (
                  <div key={sem._id || idx}>
                    <SemesterAccordion
                      semester={sem}
                      onChange={(next) => updateSemester(idx, next)}
                      onRemove={() => removeSemester(idx)}
                      gradeScale={gradeScale}
                      courseOptions={courses}
                      onCourseSearch={searchCourses}
                      precision={precision}
                    />
                    <div className="pb-3 pl-0">
                      <button
                        type="button"
                        onClick={() => saveSemester(sem)}
                        className="text-xs font-semibold text-stone-400 transition-colors hover:text-primary-700"
                      >
                        Save semester
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={addSemester}
            className="mt-6 text-sm font-semibold text-stone-600 transition-colors hover:text-primary-700"
          >
            + Add semester
          </button>
        </div>

        <div className="space-y-6 lg:sticky lg:top-20">
          <div>
            <p className="label mb-4">GPA trend</p>
            {summary.perSemester.length > 1 ? (
              <svg viewBox="0 0 100 40" className="h-16 w-full overflow-visible">
                {summary.perSemester.map((s, i) => {
                  const x = (i / (summary.perSemester.length - 1)) * 100;
                  const range = gpaMax - gpaMin || 1;
                  const y = 35 - ((s.gpa - gpaMin) / range) * 30;
                  return <circle key={i} cx={x} cy={y} r="1.5" fill="#155E38" />;
                })}
                <polyline
                  fill="none"
                  stroke="#155E38"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={summary.perSemester
                    .map((s, i) => {
                      const x = (i / (summary.perSemester.length - 1)) * 100;
                      const range = gpaMax - gpaMin || 1;
                      const y = 35 - ((s.gpa - gpaMin) / range) * 30;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            ) : (
              <p className="text-xs text-stone-400">Add more semesters to see a trend line.</p>
            )}
          </div>

          <hr className="border-stone-200" />

          <div>
            <p className="label mb-2">Department</p>
            <p className="text-sm font-semibold text-stone-900">
              {userDept ? userDept.name : 'Not set'}
            </p>
            {userDept && (
              <p className="mt-0.5 font-mono text-xs text-stone-400">{userDept.code}</p>
            )}
          </div>

          <hr className="border-stone-200" />

          <div>
            <p className="label mb-2">Graduation progress</p>
            <p className="font-mono text-sm text-stone-900">
              {summary.totalCredits}
              <span className="text-stone-400"> / {requiredCredits} credits</span>
            </p>
            <p className="mt-0.5 text-xs text-stone-400">
              {Math.max(0, requiredCredits - summary.totalCredits)} credits remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
