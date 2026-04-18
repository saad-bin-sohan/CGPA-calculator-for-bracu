interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <div className="py-12 text-center">
      <p className="text-base font-semibold text-stone-700">{title}</p>
      {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center text-sm font-semibold text-primary-700 underline-offset-2 hover:text-primary-600 hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
