'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileDown, Building2, Sigma, Layers } from 'lucide-react';
import SemesterAccordion from '../../components/SemesterAccordion';
import ProgressBar from '../../components/ProgressBar';
import SummaryCard from '../../components/SummaryCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { api } from '../../lib/api';
import { computeSummary } from '../../lib/gpa';
import {
  Department,
  Course,
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

export default function CalculatorPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [gradeScale, setGradeScale] = useState<GradeScaleEntry[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [precision, setPrecision] = useState<number>(2);
  const [templates, setTemplates] = useState<SemesterTemplate[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      termName: 'Spring 2025',
      enrollments: Array.from({ length: 4 }, () => blankEnrollment())
    }
  ]);

  useEffect(() => {
    let cancelled = false;

    // Promise.allSettled (rather than three independent, uncaught .then()
    // calls) means one failing request can't silently prevent the others
    // from populating, and lets us surface a single, honest notice instead
    // of leaving the page blank with no explanation.
    Promise.allSettled([api.getDepartments(), api.getGradeScale(), api.getSettings()]).then(
      ([deptResult, gradeResult, settingsResult]) => {
        if (cancelled) return;
        if (deptResult.status === 'fulfilled') {
          setDepartments(deptResult.value.departments || []);
        } else {
          console.error('Failed to load departments', deptResult.reason);
        }
        if (gradeResult.status === 'fulfilled') {
          setGradeScale(gradeResult.value.entries || []);
        } else {
          console.error('Failed to load grade scale', gradeResult.reason);
        }
        if (settingsResult.status === 'fulfilled') {
          setPrecision(settingsResult.value.settings?.cgpaPrecision || 2);
        } else {
          console.error('Failed to load settings', settingsResult.reason);
        }
        const anyFailed = [deptResult, gradeResult, settingsResult].some(
          (r) => r.status === 'rejected'
        );
        setLoadError(
          anyFailed
            ? "Couldn't reach the server for some reference data (departments, grade scale, or settings). You can still enter courses by hand - department selection and templates may be unavailable until this loads. Try refreshing in a moment."
            : null
        );
      }
    );

    const saved = typeof window !== 'undefined' ? localStorage.getItem('guest-plan') : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedDepartment(parsed.selectedDepartment || '');
        setSemesters(parsed.semesters || []);
      } catch {
        // ignore
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('guest-plan', JSON.stringify({ selectedDepartment, semesters }));
  }, [selectedDepartment, semesters]);

  useEffect(() => {
    if (!selectedDepartment) {
      setTemplates([]);
      return;
    }
    api
      .getTemplates(selectedDepartment)
      .then((t) => {
        setTemplates(t.templates || []);
        if ((semesters?.length || 0) === 0 || semesters.every((s) => s.enrollments.length === 0)) {
          applyTemplate(t.templates || []);
        }
      })
      .catch((err) => console.error('Failed to load templates', err));
  }, [selectedDepartment]);

  const summary = useMemo(
    () => computeSummary(semesters, precision),
    [semesters, precision]
  );
  // No fallback number here on purpose - a fabricated "required credits"
  // value (the old code defaulted to 136, CSE's number) would render even
  // when no department was selected or matched, which is misleading rather
  // than helpful. undefined means "we don't know yet", and every place this
  // is used below is expected to handle that explicitly.
  const requiredCredits = departments.find((d) => d._id === selectedDepartment)?.totalCreditsRequired;
  const selectedDept = useMemo(
    () => departments.find((d) => d._id === selectedDepartment),
    [departments, selectedDepartment]
  );

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
        enrollments: Array.from({ length: 4 }, () => blankEnrollment())
      }
    ]);
  };

  const removeSemester = (idx: number) => {
    setSemesters(semesters.filter((_, i) => i !== idx));
  };

  const searchCourses = async (query: string) => {
    if (query.length < 2) return;
    try {
      const res = await api.getCourses(query, selectedDepartment);
      setCourses(res.courses || []);
    } catch (err) {
      console.error('Course search failed', err);
    }
  };

  const applyTemplate = (tpls: SemesterTemplate[]) => {
    if (!tpls || tpls.length === 0) {
      setSemesters([
        {
          termName: 'Planned Semester',
          enrollments: Array.from({ length: 4 }, () => blankEnrollment())
        }
      ]);
      return;
    }
    const mapped: Semester[] = tpls.map((t) => ({
      termName: t.termName,
      department: selectedDepartment,
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
    setStatus('Department template applied.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-normal text-stone-900">
            Guest Calculator
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            No sign-in required. Your plan is saved in this browser.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportElementToPDF('calculator-area', 'cgpa-plan.pdf')}
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {loadError && <p className="alert-danger">{loadError}</p>}

      <div className="space-y-3">
        <div className="max-w-xs">
          <label className="label mb-2 block">Department</label>
          <select
            className="select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        {templates.length > 0 && (
          <div className="alert-info flex flex-wrap items-center justify-between gap-3">
            <span>
              {templates.length} semester template
              {templates.length > 1 ? 's' : ''} available for this department.
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

        {status && <p className="text-sm font-semibold text-success-700">{status}</p>}
      </div>

      <ProgressBar completed={summary.totalCredits} total={requiredCredits ?? null} />

      <hr className="border-stone-200" />

      <div className="grid gap-10 lg:grid-cols-[1fr_260px] lg:items-start">
        <div>
          <div id="calculator-area">
            {semesters.length === 0 ? (
              <EmptyState
                title="No semesters yet"
                description="Add a semester to start planning your CGPA."
                actionLabel="Add first semester"
                onAction={addSemester}
              />
            ) : (
              <div className="divide-y divide-stone-200 border-y border-stone-200">
                {semesters.map((semester, idx) => (
                  <SemesterAccordion
                    key={idx}
                    semester={semester}
                    onChange={(next) => updateSemester(idx, next)}
                    onRemove={() => removeSemester(idx)}
                    gradeScale={gradeScale}
                    courseOptions={courses}
                    onCourseSearch={searchCourses}
                    precision={precision}
                  />
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

        <div className="lg:sticky lg:top-20">
          <div className="divide-y divide-stone-200 border border-stone-200 bg-white">
            <SummaryCard
              title="CGPA"
              value={summary.cgpa.toFixed(Math.min(precision, 10))}
              sub={`${summary.totalCourses} unique courses`}
              icon={<Sigma className="h-4 w-4" />}
            />
            <SummaryCard
              title="Credits completed"
              value={`${summary.totalCredits}`}
              sub={
                requiredCredits
                  ? `of ${requiredCredits} required`
                  : 'Select a department to see your requirement'
              }
              icon={<Layers className="h-4 w-4" />}
            />
            <SummaryCard
              title="Department"
              value={selectedDept ? selectedDept.code : '—'}
              sub={
                selectedDept ? selectedDept.name : 'Select a department to load templates'
              }
              icon={<Building2 className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
