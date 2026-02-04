import { useMemo, useState } from 'react';
import { Course, EnrollmentInput, GradeScaleEntry, Semester } from '../types';
import { computeSummary } from '../lib/gpa';
import CourseRow from './CourseRow';
import Button from './ui/Button';
import ConfirmDialog from './ui/ConfirmDialog';
import Badge from './ui/Badge';

interface Props {
  semester: Semester;
  onChange: (next: Semester) => void;
  onRemove: () => void;
  gradeScale: GradeScaleEntry[];
  courseOptions: Course[];
  onCourseSearch: (query: string) => void;
  precision: number;
}

const SemesterAccordion = ({
  semester,
  onChange,
  onRemove,
  gradeScale,
  courseOptions,
  onCourseSearch,
  precision
}: Props) => {
  const [open, setOpen] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const summary = useMemo(
    () => computeSummary([semester], precision).perSemester[0],
    [semester, precision]
  );

  const updateEnrollment = (idx: number, next: EnrollmentInput) => {
    const clone = [...semester.enrollments];
    clone[idx] = { ...next };
    onChange({ ...semester, enrollments: clone });
  };

  const addCourse = () => {
    onChange({
      ...semester,
      enrollments: [
        ...semester.enrollments,
        {
          courseCode: '',
          courseTitle: '',
          credits: 3,
          gradePoint: 0,
          inputMethod: 'letter',
          countsTowardsCGPA: true,
          countsTowardsCredits: true,
          createdAt: new Date().toISOString()
        }
      ]
    });
  };

  const removeCourse = (idx: number) => {
    const clone = semester.enrollments.filter((_, i) => i !== idx);
    onChange({ ...semester, enrollments: clone });
  };

  return (
    <>
      <div className="rounded-4xl border border-slate-200 bg-white/80 shadow-soft backdrop-blur">
        <button
          type="button"
          className="flex w-full flex-col gap-3 px-5 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
          onClick={() => setOpen((o) => !o)}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-400 text-lg font-semibold text-white shadow-glow">
              {semester.termName.split(' ')[0]?.[0] || 'S'}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{semester.termName}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>GPA: {summary?.gpa?.toFixed(precision)}</span>
                <span>•</span>
                <span>Credits: {summary?.credits ?? 0}</span>
                <Badge variant="primary">{semester.enrollments.length} courses</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
            >
              Delete semester
            </Button>
            <span
              className={`text-slate-500 transition ${open ? 'rotate-180' : 'rotate-0'}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
        </button>
        {open && (
          <div className="space-y-4 border-t border-slate-100 p-5 animate-fade-up">
            {semester.enrollments.map((enroll, idx) => (
              <CourseRow
                key={idx}
                enrollment={enroll}
                onChange={(next) => updateEnrollment(idx, next)}
                onRemove={() => removeCourse(idx)}
                gradeScale={gradeScale}
                courseOptions={courseOptions}
                onCourseSearch={onCourseSearch}
              />
            ))}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={addCourse}>
                + Add course
              </Button>
              <div className="text-xs text-slate-500">
                Semester GPA updates automatically as you change grades.
              </div>
            </div>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete semester?"
        description="This will remove the semester and all of its courses."
        confirmLabel="Delete semester"
        danger
        onConfirm={() => {
          setConfirmOpen(false);
          onRemove();
        }}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default SemesterAccordion;
