import { cn } from '../../lib/cn';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}

export default function Switch({ checked, onChange, label, className }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
        checked ? 'border-primary/40 bg-primary/10 text-primary-700' : 'border-slate-200 text-slate-600',
        className
      )}
    >
      <span
        className={cn(
          'relative h-4 w-7 rounded-full transition',
          checked ? 'bg-primary' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow transition',
            checked ? 'translate-x-3' : 'translate-x-0'
          )}
        />
      </span>
      {label}
    </button>
  );
}
