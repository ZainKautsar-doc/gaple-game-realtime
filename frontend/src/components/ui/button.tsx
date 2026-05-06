import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border border-brand/20 bg-gradient-to-r from-brand to-secondary text-white shadow-[0_14px_36px_rgba(0,217,255,0.24)] hover:brightness-110',
  secondary:
    'border border-brand/30 bg-brand/10 text-brand-light hover:bg-brand/20',
  outline:
    'bg-transparent text-slate-100 border border-white/15 hover:bg-white/10',
  ghost: 'bg-transparent text-slate-300 hover:bg-white/10 hover:text-white',
  danger: 'bg-rose-500/20 text-rose-100 border border-rose-400/30 hover:bg-rose-500/30',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-10 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/70 disabled:cursor-not-allowed disabled:opacity-45',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export { Button };
