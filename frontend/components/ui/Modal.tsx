import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { cn } from '../../lib/cn';

type Size = 'sm' | 'md' | 'lg';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: Size;
  children: ReactNode;
}

const sizeStyles: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl'
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        className={cn(
          'relative w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-card',
          sizeStyles[size]
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <h3 id="modal-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h3>
        )}
        {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
