interface Props {
  completed: number;
  total: number;
}

const ProgressBar = ({ completed, total }: Props) => {
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="font-semibold uppercase tracking-widest">Credits progress</span>
        <span className="font-mono tabular-nums">
          {completed} / {total}
          <span className="ml-1.5 text-stone-400">({percent}%)</span>
        </span>
      </div>
      <div className="relative h-1.5 w-full rounded-none bg-stone-200">
        <div
          className="h-full bg-primary-700 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
