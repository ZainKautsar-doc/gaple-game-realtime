import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Avatar({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-none border-[3px] border-nb-outline bg-nb-secondary font-mono text-sm font-bold text-nb-on-surface shadow-nb-sm',
        className
      )}
      {...props}
    />
  );
}
