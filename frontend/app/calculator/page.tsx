'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileDown, Building2, Sigma, Layers } from 'lucide-react';
import SemesterAccordion from '../../components/SemesterAccordion';
import ProgressBar from '../../components/ProgressBar';
import SummaryCard from '../../components/SummaryCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
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
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Guest CGPA Calculator</h1>
          <p className="text-sm text-slate-600">
            No login required. Your plan is stored locally in this browser.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => exportElementToPDF('calculator-area', 'cgpa-plan.pdf')}
        >
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card className="space-y-4">
            <div>
              <label className="label">Department</label>
              <select
                className="select mt-2"
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

            {templates.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-700">
                <span>{templates.length} template(s) available for this department.</span>
                <Button variant="outline" size="sm" onClick={() => applyTemplate(templates)}>
                  Apply template
                </Button>
              </div>
            )}
            {status && (
              <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-2 text-xs font-semibold text-success-700">
                {status}
              </div>
            )}
          </Card>

          <Card>
            <ProgressBar completed={summary.totalCredits} total={requiredCredits} />
          </Card>

          <div id="calculator-area" className="space-y-4">
            {semesters.length === 0 && (
              <EmptyState
                title="No semesters yet"
                description="Add a semester to start planning your CGPA journey."
                actionLabel="Add semester"
                onAction={addSemester}
              />
            )}
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

          <Button variant="outline" onClick={addSemester}>
            + Add semester
          </Button>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <SummaryCard
            title="CGPA"
            value={summary.cgpa.toFixed(Math.min(precision, 10))}
            sub={`${summary.totalCourses} unique courses`}
            icon={<Sigma className="h-5 w-5" />}
            tone="primary"
          />
          <SummaryCard
            title="Completed credits"
            value={`${summary.totalCredits}`}
            sub={`of ${requiredCredits} required`}
            icon={<Layers className="h-5 w-5" />}
            tone="accent"
          />
          <SummaryCard
            title="Department"
            value={selectedDept ? selectedDept.code : 'Not selected'}
            sub={selectedDept ? selectedDept.name : 'Select a department to load templates'}
            icon={<Building2 className="h-5 w-5" />}
          />
        </div>
      </div>
    </div>
  );
}
