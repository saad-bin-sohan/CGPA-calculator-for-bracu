'use client';

import { useEffect, useMemo, useState } from 'react';
import SemesterAccordion from '../../components/SemesterAccordion';
import ProgressBar from '../../components/ProgressBar';
import SummaryCard from '../../components/SummaryCard';
import { api } from '../../lib/api';
import { computeSummary } from '../../lib/gpa';
import { Department, Course, GradeScaleEntry, Semester, EnrollmentInput, SemesterTemplate } from '../../types';
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
  const [precision, setPrecision] = useState<number>(10);
  const [templates, setTemplates] = useState<SemesterTemplate[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([
    { termName: 'Spring 2025', enrollments: Array.from({ length: 4 }, () => blankEnrollment()) }
  ]);

  useEffect(() => {
    api.getDepartments().then((d) => setDepartments(d.departments || []));
    api.getGradeScale().then((g) => setGradeScale(g.entries || []));
    api.getSettings().then((s) => setPrecision(s.settings?.cgpaPrecision || 10));
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
    api.getTemplates(selectedDepartment).then((t) => {
      setTemplates(t.templates || []);
      if ((semesters?.length || 0) === 0 || semesters.every((s) => s.enrollments.length === 0)) {
        applyTemplate(t.templates || []);
      }
    });
  }, [selectedDepartment]);

  const summary = useMemo(() => computeSummary(semesters, precision), [semesters, precision]);
  const requiredCredits =
    departments.find((d) => d._id === selectedDepartment)?.totalCreditsRequired || 136;

  const updateSemester = (idx: number, next: Semester) => {
    const clone = [...semesters];
    clone[idx] = next;
    setSemesters(clone);
  };

  const addSemester = () => {
    setSemesters([
      ...semesters,
      { termName: `Semester ${semesters.length + 1}`, enrollments: Array.from({ length: 4 }, () => blankEnrollment()) }
    ]);
  };

  const removeSemester = (idx: number) => {
    setSemesters(semesters.filter((_, i) => i !== idx));
  };

  const searchCourses = async (query: string) => {
    if (query.length < 2) return;
    const res = await api.getCourses(query, selectedDepartment);
    setCourses(res.courses || []);
  };

  const applyTemplate = (tpls: SemesterTemplate[]) => {
    if (!tpls || tpls.length === 0) {
      setSemesters([{ termName: 'Planned Semester', enrollments: Array.from({ length: 4 }, () => blankEnrollment()) }]);
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
    setStatus('Loaded department template');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guest CGPA Calculator</h1>
          <p className="text-slate-600">No login required. Data stays in your browser.</p>
        </div>
        <button
          className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => exportElementToPDF('calculator-area', 'cgpa-plan.pdf')}
        >
          Export as PDF
        </button>
      </div>
      <div className="card grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Department</label>
          <select
            className="mt-1 w-full rounded border border-slate-200 px-3 py-2"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>
        <SummaryCard title="CGPA" value={summary.cgpa.toFixed(Math.min(precision, 10))} />
        <SummaryCard
          title="Completed credits"
          value={`${summary.totalCredits}`}
          sub={`of ${requiredCredits} required`}
        />
      </div>
      {templates.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <span>{templates.length} template(s) available for this department.</span>
          <button
            className="rounded border border-primary px-3 py-2 text-xs font-semibold text-primary"
            onClick={() => applyTemplate(templates)}
          >
            Apply template
          </button>
        </div>
      )}
      {status && <p className="text-xs text-green-600">{status}</p>}
      <ProgressBar completed={summary.totalCredits} total={requiredCredits} />
      <div id="calculator-area" className="space-y-4">
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
