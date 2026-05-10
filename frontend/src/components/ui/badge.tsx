import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center border-[3px] border-nb-outline bg-nb-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-nb-on-surface rounded-none',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
