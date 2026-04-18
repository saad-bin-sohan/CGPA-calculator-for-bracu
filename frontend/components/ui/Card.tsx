import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'default' | 'sm' | 'flush';

interface Props {
  className?: string;
  children: ReactNode;
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  default: 'surface',
  sm: 'surface-sm',
  flush: 'rounded-md border border-stone-200 bg-white'
};

export default function Card({ className, children, variant = 'default' }: Props) {
  return <div className={cn(variantStyles[variant], className)}>{children}</div>;
}
