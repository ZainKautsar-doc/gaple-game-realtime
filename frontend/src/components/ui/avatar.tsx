import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Avatar({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-aqua/30 to-mint/20 font-[var(--font-display)] text-sm font-bold text-white',
        className
      )}
      {...props}
    />
  );
}
