import { cn } from '../../lib/cn';

interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedToggleProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (next: T) => void;
}

interface LegacyToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
}

function isSegmentedToggle<T extends string>(
  props: LegacyToggleProps | SegmentedToggleProps<T>
): props is SegmentedToggleProps<T> {
  return 'options' in props;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange
}: SegmentedToggleProps<T>) {
  return (
    <div className="inline-flex overflow-hidden rounded-sm border border-stone-300 bg-white">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus:outline-none',
            value === option.value
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Toggle(props: LegacyToggleProps): JSX.Element;
function Toggle<T extends string>(props: SegmentedToggleProps<T>): JSX.Element;
function Toggle<T extends string>(props: LegacyToggleProps | SegmentedToggleProps<T>) {
  if (isSegmentedToggle(props)) {
    return <SegmentedControl {...props} />;
  }

  const { checked, onChange, label, description } = props;

  return (
    <div className="rounded-md border border-stone-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-stone-800">{label}</p>
          {description && <p className="mt-1 text-xs text-stone-500">{description}</p>}
        </div>
        <SegmentedControl
          options={[
            { value: 'off', label: 'Off' },
            { value: 'on', label: 'On' }
          ]}
          value={checked ? 'on' : 'off'}
          onChange={(next) => onChange(next === 'on')}
        />
      </div>
    </div>
  );
}

export default Toggle;
