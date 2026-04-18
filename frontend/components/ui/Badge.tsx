import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  default: 'badge',
  primary: 'badge',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger'
};

export default function Badge({ children, variant = 'default', className }: Props) {
  return <span className={cn(variantStyles[variant], className)}>{children}</span>;
}
