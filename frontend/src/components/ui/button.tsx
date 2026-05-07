import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-casino-gold',
  secondary: 'btn-casino-outline',
  outline: 'btn-casino-outline',
  ghost: 'bg-transparent text-casino-text-secondary hover:bg-white/5 hover:text-casino-text-primary',
  danger: 'bg-red-900/40 text-red-200 border border-red-500/30 hover:bg-red-900/60',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: '',
  lg: 'h-14 px-8 text-lg',
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
        'inline-flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-casino-gold/70 disabled:cursor-not-allowed disabled:opacity-45',
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
