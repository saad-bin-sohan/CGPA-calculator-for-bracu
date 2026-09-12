interface Props {
  completed: number;
  /** Pass null when there's no real requirement to measure against yet
   * (e.g. no department selected) rather than fabricating a number. */
  total: number | null;
}

const ProgressBar = ({ completed, total }: Props) => {
  if (total === null) {
    return (
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-500">
          Credits progress
        </span>
        <p className="text-xs text-stone-400">
          Select a department to track progress toward your credit requirement.
        </p>
      </div>
    );
  }
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
