'use client';

import { useId, useState } from 'react';
import { Course, EnrollmentInput, GradeScaleEntry } from '../types';
import GradeSelector from './GradeSelector';
import Switch from './ui/Switch';
import Toggle from './ui/Toggle';
import ConfirmDialog from './ui/ConfirmDialog';

interface Props {
  enrollment: EnrollmentInput;
  onChange: (next: EnrollmentInput) => void;
  onRemove: () => void;
  courseOptions: Course[];
  onCourseSearch: (query: string) => void;
  gradeScale: GradeScaleEntry[];
}

const inputModeOptions = [
  { value: 'letter' as const, label: 'Letter' },
  { value: 'points' as const, label: 'Points' },
  { value: 'percentage' as const, label: '%' }
];

const CourseRow = ({
  enrollment,
  onChange,
  onRemove,
  courseOptions,
  onCourseSearch,
  gradeScale
}: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const uid = useId();
  const datalistId = `course-options-${uid}`;

  const updateGradeFromPercentage = (percentage: number) => {
    const match = gradeScale.find(
      (g) => !g.isSpecial && percentage >= g.minPercentage && percentage <= g.maxPercentage
    );
    if (match) {
      onChange({
        ...enrollment,
        percentage,
        gradePoint: match.gradePoint,
        gradeLetter: match.letter
      });
    } else {
      onChange({ ...enrollment, percentage, gradePoint: 0 });
    }
  };

  const selectCourse = (code: string) => {
    const found = courseOptions.find((c) => c.code === code.toUpperCase());
    if (found) {
      onChange({
        ...enrollment,
        course: found._id,
        courseCode: found.code,
        courseTitle: found.title,
        credits: found.credits,
        countsTowardsCGPA: found.countsTowardsCGPA,
        countsTowardsCredits: found.countsTowardsCredits
      });
    } else {
      onChange({ ...enrollment, courseCode: code });
    }
  };

  return (
    <>
      <div className="-mx-0 py-4 transition-colors hover:bg-stone-50">
        <div className="grid gap-3 lg:grid-cols-12 lg:items-start lg:gap-4">
          <div className="lg:col-span-3">
            <label className="label mb-1.5 block">Course</label>
            <input
              list={datalistId}
              className="input font-mono uppercase tracking-tight"
              value={enrollment.courseCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onCourseSearch(value);
                selectCourse(value);
              }}
              placeholder="e.g. CSE110"
            />
            <datalist id={datalistId}>
              {courseOptions.map((c) => (
                <option key={c._id} value={c.code}>
                  {`${c.code} — ${c.title}`}
                </option>
              ))}
            </datalist>
            {enrollment.courseTitle && (
              <p className="mt-1 truncate text-xs text-stone-400">{enrollment.courseTitle}</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="label mb-1.5 block">Credits</label>
            <input
              type="number"
              className="input font-mono"
              value={enrollment.credits}
              onChange={(e) => onChange({ ...enrollment, credits: Number(e.target.value) })}
              step="0.5"
              min="0"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="label mb-1.5 block">Mode</label>
            <Toggle
              options={inputModeOptions}
              value={enrollment.inputMethod}
              onChange={(mode) => onChange({ ...enrollment, inputMethod: mode })}
            />
          </div>

          <div className="lg:col-span-4">
            <label className="label mb-1.5 block">Grade</label>
            {enrollment.inputMethod === 'letter' && (
              <GradeSelector
                gradeScale={gradeScale}
                value={enrollment.gradeLetter}
                onSelect={(letter, gradePoint) =>
                  onChange({ ...enrollment, gradeLetter: letter, gradePoint })
                }
              />
            )}
            {enrollment.inputMethod === 'points' && (
              <div className="relative">
                <input
                  type="number"
                  className="input pr-12 font-mono"
                  value={enrollment.gradePoint}
                  onChange={(e) =>
                    onChange({
                      ...enrollment,
                      gradePoint: Number(e.target.value),
                      gradeLetter: undefined
                    })
                  }
                  min="0"
                  max="4"
                  step="0.1"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-stone-400">
                  /4.0
                </span>
              </div>
            )}
            {enrollment.inputMethod === 'percentage' && (
              <div className="relative">
                <input
                  type="number"
                  className="input pr-8 font-mono"
                  value={enrollment.percentage ?? ''}
                  onChange={(e) => updateGradeFromPercentage(Number(e.target.value))}
                  min="0"
                  max="100"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-stone-400">
                  %
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Switch
            checked={enrollment.countsTowardsCGPA}
            onChange={(next) => onChange({ ...enrollment, countsTowardsCGPA: next })}
            label="CGPA"
          />
          <Switch
            checked={enrollment.countsTowardsCredits}
            onChange={(next) => onChange({ ...enrollment, countsTowardsCredits: next })}
            label="Credits"
          />
          <button
            type="button"
            className="ml-auto text-xs text-stone-400 transition-colors hover:text-danger-700"
            onClick={() => setConfirmOpen(true)}
          >
            Remove
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove course?"
        description="This will delete the course entry from this semester."
        confirmLabel="Remove"
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

export default CourseRow;
