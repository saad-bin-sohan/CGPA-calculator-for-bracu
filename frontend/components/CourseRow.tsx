import { useState } from 'react';
import { Course, EnrollmentInput, GradeScaleEntry } from '../types';
import GradeSelector from './GradeSelector';
import Switch from './ui/Switch';
import ConfirmDialog from './ui/ConfirmDialog';
import Button from './ui/Button';
import { cn } from '../lib/cn';

interface Props {
  enrollment: EnrollmentInput;
  onChange: (next: EnrollmentInput) => void;
  onRemove: () => void;
  courseOptions: Course[];
  onCourseSearch: (query: string) => void;
  gradeScale: GradeScaleEntry[];
}

const CourseRow = ({ enrollment, onChange, onRemove, courseOptions, onCourseSearch, gradeScale }: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const updateGradeFromPercentage = (percentage: number) => {
    const match = gradeScale.find(
      (g) => !g.isSpecial && percentage >= g.minPercentage && percentage <= g.maxPercentage
    );
    if (match) {
      onChange({ ...enrollment, percentage, gradePoint: match.gradePoint, gradeLetter: match.letter });
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
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-soft backdrop-blur sm:p-5">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-4">
            <label className="label">Course</label>
            <input
              list="course-options"
              className="input mt-2 font-mono uppercase tracking-tight"
              value={enrollment.courseCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                onCourseSearch(value);
                selectCourse(value);
              }}
              placeholder="e.g., CSE110"
            />
            <datalist id="course-options">
              {courseOptions.map((c) => (
                <option key={c._id} value={c.code}>{`${c.code} — ${c.title}`}</option>
              ))}
            </datalist>
            <p className="mt-2 text-xs text-slate-500">
              {enrollment.courseTitle || 'Search and select a course title.'}
            </p>
          </div>

          <div className="lg:col-span-2">
            <label className="label">Credits</label>
            <input
              type="number"
              className="input mt-2"
              value={enrollment.credits}
              onChange={(e) => onChange({ ...enrollment, credits: Number(e.target.value) })}
              step="0.5"
              min="0"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="label">Input mode</label>
            <div className="mt-2 flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
              {(['letter', 'points', 'percentage'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onChange({ ...enrollment, inputMethod: mode })}
                  className={cn(
                    'flex-1 rounded-xl px-2 py-2 text-xs font-semibold capitalize transition',
                    enrollment.inputMethod === mode
                      ? 'bg-primary/10 text-primary-700'
                      : 'text-slate-500 hover:text-primary-700'
                  )}
                >
                  {mode === 'points' ? 'Points' : mode}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4">
            <label className="label">Grade</label>
            <div className="mt-2">
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
                    className="input pr-12"
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
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    / 4.0
                  </span>
                </div>
              )}
              {enrollment.inputMethod === 'percentage' && (
                <div className="relative">
                  <input
                    type="number"
                    className="input pr-10"
                    value={enrollment.percentage ?? ''}
                    onChange={(e) => updateGradeFromPercentage(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    %
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Switch
            checked={enrollment.countsTowardsCGPA}
            onChange={(next) => onChange({ ...enrollment, countsTowardsCGPA: next })}
            label="Counts CGPA"
          />
          <Switch
            checked={enrollment.countsTowardsCredits}
            onChange={(next) => onChange({ ...enrollment, countsTowardsCredits: next })}
            label="Counts credits"
          />
          <div className="ml-auto">
            <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
              Remove
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove course?"
        description="This will delete the course entry from the semester."
        confirmLabel="Remove course"
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
