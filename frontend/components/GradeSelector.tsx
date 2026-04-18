import { cn } from '../lib/cn';
import type { GradeScaleEntry } from '../types';

interface Props {
  gradeScale: GradeScaleEntry[];
  value?: string;
  onSelect: (letter: string, gradePoint: number) => void;
}

export default function GradeSelector({ gradeScale, value, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {gradeScale.map((g) => (
        <button
          key={g.letter}
          type="button"
          onClick={() => onSelect(g.letter, g.gradePoint)}
          className={cn(
            'min-w-[2rem] px-2 py-1.5 font-mono text-xs font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-700',
            value === g.letter
              ? 'bg-stone-900 text-white'
              : g.isSpecial
                ? 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
          )}
        >
          {g.letter}
        </button>
      ))}
    </div>
  );
}
