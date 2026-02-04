import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'default' | 'strong' | 'subtle' | 'glass';

interface Props {
  className?: string;
  children: ReactNode;
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  default: 'card',
  strong: 'card-strong',
  subtle: 'card-subtle',
  glass: 'glass-panel'
};

export default function Card({ className, children, variant = 'default' }: Props) {
  return <div className={cn(variantStyles[variant], className)}>{children}</div>;
}
