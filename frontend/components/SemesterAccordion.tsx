import { useMemo, useState } from 'react';
import { Course, EnrollmentInput, GradeScaleEntry, Semester } from '../types';
import { computeSummary } from '../lib/gpa';
import CourseRow from './CourseRow';

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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div>
          <p className="text-sm font-semibold text-slate-800">{semester.termName}</p>
          <p className="text-xs text-slate-500">
            GPA: {summary?.gpa?.toFixed(precision)} • Credits: {summary?.credits ?? 0}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-600"
          >
            Delete semester
          </button>
          <span className="text-slate-500">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      {open && (
        <div className="space-y-4 border-t border-slate-100 p-4">
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
            <button
              type="button"
              onClick={addCourse}
              className="rounded-md border border-dashed border-primary px-4 py-2 text-sm font-semibold text-primary"
            >
              + Add course
            </button>
            <div className="text-xs text-slate-500">
              Semester GPA updates automatically as you change grades.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemesterAccordion;
