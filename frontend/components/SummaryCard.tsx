import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: string;
  sub?: string;
  icon?: ReactNode;
  [key: string]: unknown;
}

const SummaryCard = ({ title, value, sub, icon }: Props) => (
  <div className="p-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">{title}</p>
      {icon && <span className="text-stone-300">{icon}</span>}
    </div>
    <p className="mt-2 font-display text-2xl font-normal tabular-nums text-stone-900">
      {value}
    </p>
    {sub && <p className="mt-0.5 text-xs text-stone-500">{sub}</p>}
  </div>
);

export default SummaryCard;
