interface Props {
  completed: number;
  total: number;
}

const ProgressBar = ({ completed, total }: Props) => {
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span className="font-semibold">Credits progress</span>
        <span className="tabular-nums">
          {completed} / {total} ({percent}%)
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-slate-200/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-accent-400 shadow-glow transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
        {[25, 50, 75].map((mark) => (
          <span
            key={mark}
            className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-white/70"
            style={{ left: `${mark}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
