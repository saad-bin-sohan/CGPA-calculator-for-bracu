'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Course, EnrollmentInput, GradeScaleEntry, Semester } from '../types';
import { computeSummary } from '../lib/gpa';
import CourseRow from './CourseRow';
import ConfirmDialog from './ui/ConfirmDialog';
import { cn } from '../lib/cn';

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
  const [editingName, setEditingName] = useState(false);

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
    onChange({
      ...semester,
      enrollments: semester.enrollments.filter((_, i) => i !== idx)
    });
  };

  return (
    <>
      <div>
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          className="flex w-full cursor-pointer select-none items-center justify-between py-4 transition-colors hover:bg-stone-50"
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen((o) => !o);
            }
          }}
        >
          <div
            className="flex min-w-0 flex-1 items-center gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            {editingName ? (
              <input
                autoFocus
                className="border-b border-stone-400 bg-transparent text-sm font-semibold text-stone-900 focus:border-primary-700 focus:outline-none"
                value={semester.termName}
                onChange={(e) => onChange({ ...semester, termName: e.target.value })}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') {
                    setEditingName(false);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <button
                type="button"
                className="text-sm font-semibold text-stone-900 transition-colors hover:text-primary-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingName(true);
                }}
                title="Click to rename"
              >
                {semester.termName}
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <span className="font-mono">
                GPA {summary?.gpa != null ? summary.gpa.toFixed(2) : '—'}
              </span>
              <span>·</span>
              <span className="font-mono">{summary?.credits ?? 0} cr</span>
              <span>·</span>
              <span>{semester.enrollments.length} courses</span>
            </div>
          </div>

          <div
            className="flex shrink-0 items-center gap-4 pl-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="text-xs text-stone-400 transition-colors hover:text-danger-700"
              onClick={() => setConfirmOpen(true)}
            >
              Remove
            </button>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-stone-400 transition-transform duration-200',
                open && 'rotate-180'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
              }}
            />
          </div>
        </div>

        {open && (
          <div className="animate-fade-up pb-6">
            {semester.enrollments.length > 0 ? (
              <div className="divide-y divide-stone-100">
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
              </div>
            ) : (
              <p className="py-4 text-sm text-stone-400">
                No courses yet.{` `}
                <button
                  type="button"
                  onClick={addCourse}
                  className="font-semibold text-primary-700 hover:text-primary-800"
                >
                  Add one
                </button>
              </p>
            )}

            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={addCourse}
                className="text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
              >
                + Add course
              </button>
              <p className="text-xs text-stone-400">GPA updates as you change grades</p>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove semester?"
        description="This will delete the semester and all of its courses. This cannot be undone."
        confirmLabel="Remove semester"
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
