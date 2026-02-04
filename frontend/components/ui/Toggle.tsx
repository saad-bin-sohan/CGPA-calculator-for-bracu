import { cn } from '../../lib/cn';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  className?: string;
}

export default function Toggle({ checked, onChange, label, description, className }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
        checked ? 'border-primary/40 bg-primary/5' : 'border-slate-200 bg-white',
        className
      )}
    >
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <span
        className={cn(
          'relative h-6 w-11 rounded-full transition',
          checked ? 'bg-primary' : 'bg-slate-200'
        )}
      >
        <span
          className={cn(
            'absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </span>
    </button>
  );
}
