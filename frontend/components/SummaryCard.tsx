import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface Props {
  title: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  tone?: 'primary' | 'accent' | 'neutral' | 'success';
}

const toneStyles: Record<NonNullable<Props['tone']>, string> = {
  primary: 'border-primary/15 bg-primary/5',
  accent: 'border-accent/15 bg-accent/5',
  neutral: 'border-slate-200 bg-white/80',
  success: 'border-success/15 bg-success/5'
};

const SummaryCard = ({ title, value, sub, icon, tone = 'neutral' }: Props) => (
  <div
    className={cn(
      'rounded-3xl border p-5 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-card',
      toneStyles[tone]
    )}
  >
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {icon && <span className="text-slate-400">{icon}</span>}
    </div>
    <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
    {sub && <p className="mt-1 text-xs text-slate-600">{sub}</p>}
  </div>
);

export default SummaryCard;
