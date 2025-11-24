import { useMemo } from 'react';
import { Course, EnrollmentInput, GradeScaleEntry } from '../types';

interface Props {
  enrollment: EnrollmentInput;
  onChange: (next: EnrollmentInput) => void;
  onRemove: () => void;
  courseOptions: Course[];
  onCourseSearch: (query: string) => void;
  gradeScale: GradeScaleEntry[];
}

const CourseRow = ({ enrollment, onChange, onRemove, courseOptions, onCourseSearch, gradeScale }: Props) => {
  const letters = useMemo(
    () => gradeScale.map((g) => g.letter),
    [gradeScale]
  );

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
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 md:grid-cols-6 md:items-center">
      <div className="md:col-span-2">
        <label className="block text-xs font-semibold text-slate-500">Course code</label>
        <input
          list="course-options"
          className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
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
        <p className="mt-1 text-xs text-slate-500">{enrollment.courseTitle || 'Select a course'}</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500">Credits</label>
        <input
          type="number"
          className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          value={enrollment.credits}
          onChange={(e) => onChange({ ...enrollment, credits: Number(e.target.value) })}
          step="0.5"
          min="0"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500">Input mode</label>
        <select
          className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          value={enrollment.inputMethod}
          onChange={(e) => onChange({ ...enrollment, inputMethod: e.target.value as any })}
        >
          <option value="letter">Letter</option>
          <option value="points">Grade points</option>
          <option value="percentage">Percentage</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500">Grade</label>
        {enrollment.inputMethod === 'letter' && (
          <select
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            value={enrollment.gradeLetter || ''}
            onChange={(e) => {
              const letter = e.target.value;
              const match = gradeScale.find((g) => g.letter === letter);
              onChange({
                ...enrollment,
                gradeLetter: letter,
                gradePoint: match ? match.gradePoint : 0
              });
            }}
          >
            <option value="">Select</option>
            {letters.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        )}
        {enrollment.inputMethod === 'points' && (
          <input
            type="number"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            value={enrollment.gradePoint}
            onChange={(e) =>
              onChange({ ...enrollment, gradePoint: Number(e.target.value), gradeLetter: undefined })
            }
            min="0"
            max="4"
            step="0.1"
          />
        )}
        {enrollment.inputMethod === 'percentage' && (
          <input
            type="number"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            value={enrollment.percentage ?? ''}
            onChange={(e) => updateGradeFromPercentage(Number(e.target.value))}
            min="0"
            max="100"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            onChange({ ...enrollment, countsTowardsCGPA: !enrollment.countsTowardsCGPA })
          }
          className={`rounded border px-3 py-2 text-xs font-semibold ${
            enrollment.countsTowardsCGPA ? 'border-primary text-primary' : 'border-slate-200'
          }`}
        >
          Counts CGPA
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({ ...enrollment, countsTowardsCredits: !enrollment.countsTowardsCredits })
          }
          className={`rounded border px-3 py-2 text-xs font-semibold ${
            enrollment.countsTowardsCredits ? 'border-primary text-primary' : 'border-slate-200'
          }`}
        >
          Counts Credits
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto rounded bg-red-50 px-3 py-2 text-xs font-semibold text-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CourseRow;
