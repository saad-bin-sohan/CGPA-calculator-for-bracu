import { GradeScaleEntry } from '../types';
import { cn } from '../lib/cn';

interface Props {
  gradeScale: GradeScaleEntry[];
  value?: string;
  onSelect: (letter: string, gradePoint: number) => void;
}

export default function GradeSelector({ gradeScale, value, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {gradeScale.map((entry) => {
        const active = value === entry.letter;
        const isSpecial = entry.isSpecial;
        return (
          <button
            key={entry._id || entry.letter}
            type="button"
            onClick={() => onSelect(entry.letter, entry.gradePoint)}
            className={cn(
              'rounded-xl border px-2 py-2 text-xs font-semibold transition',
              active
                ? 'border-primary bg-primary/10 text-primary-700 shadow-soft'
                : 'border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary-700',
              isSpecial && !active ? 'border-warning/40 text-warning-700' : ''
            )}
          >
            <div className="text-sm">{entry.letter}</div>
            <div className="text-[10px] text-slate-400">{entry.gradePoint.toFixed(2)}</div>
          </button>
        );
      })}
    </div>
  );
}
