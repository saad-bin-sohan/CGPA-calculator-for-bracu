'use client';

import { useEffect, useId, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-stone-900/50" onClick={onClose} aria-hidden="true" />
      <div
        className={cn(
          'relative z-10 mx-4 w-full max-w-lg rounded-md border border-stone-200 bg-white shadow-lg',
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            <h3 id={titleId} className="font-sans text-base font-semibold text-stone-900">
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
