interface Props {
  title: string;
  value: string;
  sub?: string;
}

const SummaryCard = ({ title, value, sub }: Props) => (
  <div className="card space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
    <p className="text-2xl font-bold text-slate-900">{value}</p>
    {sub && <p className="text-xs text-slate-600">{sub}</p>}
  </div>
);

export default SummaryCard;
