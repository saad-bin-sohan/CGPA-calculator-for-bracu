interface Props {
  completed: number;
  total: number;
}

const ProgressBar = ({ completed, total }: Props) => {
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
        <span>Credits progress</span>
        <span>
          {completed} / {total} ({percent}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percent}%`, transition: 'width 200ms ease' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
