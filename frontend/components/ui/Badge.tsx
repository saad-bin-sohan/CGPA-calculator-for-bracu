import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface Props {
  children: ReactNode;
  className?: string;
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: 'badge',
  primary: 'badge badge-primary',
  success: 'badge badge-success',
  warning: 'badge badge-warning',
  danger: 'badge badge-danger'
};

export default function Badge({ children, className, variant = 'default' }: Props) {
  return <span className={cn(variants[variant], className)}>{children}</span>;
}
