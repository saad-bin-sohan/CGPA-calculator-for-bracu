'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileDown, Save, Sigma, Layers, TrendingUp, GraduationCap } from 'lucide-react';
import SemesterAccordion from '../../components/SemesterAccordion';
import ProgressBar from '../../components/ProgressBar';
import SummaryCard from '../../components/SummaryCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { api } from '../../lib/api';
import { computeSummary } from '../../lib/gpa';
import { Course, Department, GradeScaleEntry, Semester, EnrollmentInput, SemesterTemplate } from '../../types';
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

        if (meRes?.name) {
          setUserName(meRes.name);
        }

        if (meRes?.department) {
          setUserDept(meRes.department as Department);

          api.getTemplates((meRes.department as Department)._id).then((t) => {
            setTemplates(t.templates || []);

            if ((semRes.semesters || []).length === 0 && (t.templates || []).length > 0) {
              // ✅ FIX: use optional chaining so department may be undefined at the type level
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
        setError(err.message || 'Failed to load dashboard. Please login again.');
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

  const summary = useMemo(() => computeSummary(semesters, precision), [semesters, precision]);
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
  const trendTone = trendLabel === 'Up' ? 'success' : 'neutral';

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
    if (sem._id) {
      await api.semesters.delete(sem._id);
    }
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
    for (const sem of semesters) {
      await saveSemester(sem);
    }
    setMessage('Semesters saved');
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
    setStatus('Template applied to your plan');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
            Welcome back, {userName}
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">Student Dashboard</h1>
          <p className="text-sm text-slate-600">
            Manage semesters, track CGPA, and monitor graduation progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => exportElementToPDF('dashboard-area', 'cgpa-plan.pdf')}
          >
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="primary" onClick={saveAll}>
            <Save className="h-4 w-4" />
            Save all
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-2 text-sm text-danger-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-2 text-sm text-success-700">
          {message}
        </div>
      )}
      {status && (
        <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-2 text-sm text-success-700">
          {status}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-4">
        <SummaryCard
          title="CGPA"
          value={summary.cgpa.toFixed(Math.min(precision, 10))}
          sub={`${summary.totalCourses} unique courses`}
          icon={<Sigma className="h-5 w-5" />}
          tone="primary"
        />
        <SummaryCard
          title="Credits earned"
          value={`${summary.totalCredits}`}
          sub={`Goal: ${requiredCredits}`}
          icon={<Layers className="h-5 w-5" />}
          tone="accent"
        />
        <SummaryCard
          title="Semesters"
          value={`${semesters.length}`}
          sub="Planned semesters"
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <SummaryCard
          title="Trend"
          value={trendLabel}
          sub={`${summary.perSemester.length} semester(s) tracked`}
          icon={<TrendingUp className="h-5 w-5" />}
          tone={trendTone}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {templates.length > 0 && (
            <Card className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {templates.length} template(s) available for your department.
                </p>
                <p className="text-xs text-slate-500">Apply a template to start faster.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => applyTemplate(templates)}>
                Apply template
              </Button>
            </Card>
          )}

          <Card>
            <ProgressBar completed={summary.totalCredits} total={requiredCredits} />
          </Card>

          <div id="dashboard-area" className="space-y-4">
            {semesters.length === 0 && (
              <EmptyState
                title="No semesters saved"
                description="Create your first semester and sync it instantly."
                actionLabel="Add semester"
                onAction={addSemester}
              />
            )}
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
                <Button variant="ghost" size="sm" onClick={() => saveSemester(sem)}>
                  Save semester
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={addSemester}>
            + Add semester
          </Button>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">GPA trend</p>
              <span className="text-xs text-slate-500">Last {summary.perSemester.length}</span>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              {summary.perSemester.length > 1 ? (
                <svg viewBox="0 0 100 40" className="h-20 w-full">
                  <polyline
                    fill="none"
                    stroke="url(#gpaGradient)"
                    strokeWidth="3"
                    points={summary.perSemester
                      .map((s, i) => {
                        const x = (i / (summary.perSemester.length - 1)) * 100;
                        const range = gpaMax - gpaMin || 1;
                        const y = 35 - ((s.gpa - gpaMin) / range) * 30;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                  <defs>
                    <linearGradient id="gpaGradient" x1="0" x2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                <p className="text-xs text-slate-500">Add more semesters to see a trend line.</p>
              )}
            </div>
          </Card>

          <SummaryCard
            title="Department"
            value={userDept ? `${userDept.name}` : 'Not set'}
            sub={userDept ? `Code: ${userDept.code}` : 'Select a department'}
          />
        </div>
      </div>
    </div>
  );
}
