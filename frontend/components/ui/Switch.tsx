interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  id?: string;
}

export default function Switch({ checked, onChange, label, id }: Props) {
  const switchId = id || `switch-${label?.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <label htmlFor={switchId} className="inline-flex cursor-pointer items-center gap-2">
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'relative h-5 w-9 rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 focus-visible:ring-offset-2',
          checked ? 'border-primary-700 bg-primary-700' : 'border-stone-300 bg-stone-100'
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked ? 'left-4' : 'left-0.5'
          ].join(' ')}
        />
      </button>
      {label && <span className="select-none text-xs font-medium text-stone-600">{label}</span>}
    </label>
  );
}
