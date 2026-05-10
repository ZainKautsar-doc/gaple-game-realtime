import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'nb-btn nb-btn-primary',
  secondary: 'nb-btn nb-btn-secondary',
  outline: 'nb-btn nb-btn-secondary',
  ghost:
    'border-[3px] border-nb-outline bg-nb-surface text-nb-on-surface font-mono text-xs font-bold uppercase shadow-nb-sm hover:bg-nb-primary hover:text-nb-white active:translate-x-1 active:translate-y-1 active:shadow-none',
  danger: 'nb-btn nb-btn-danger',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 py-2',
  md: 'min-h-11 px-5 py-2.5',
  lg: 'min-h-14 px-8 py-3 text-sm',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', type = 'button', ...props },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-nb-outline disabled:cursor-not-allowed disabled:border-nb-outline disabled:bg-[#dcd8e8] disabled:text-nb-placeholder disabled:shadow-none',
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
