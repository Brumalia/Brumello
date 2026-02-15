'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

/**
 * Mission Control Button Component
 * Geist Sans, softened green, 6px corners
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const baseStyles =
      'font-sans text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-focus tracking-tight';

    const variants = {
      primary:
        'bg-brand-green text-bg-primary hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(0,232,92,0.2)] active:translate-y-0',
      secondary:
        'bg-transparent border border-border-bright text-text-secondary hover:border-brand-green hover:text-text-primary hover:-translate-y-0.5',
      ghost: 'bg-transparent text-text-muted hover:text-text-primary hover:bg-bg-hover',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
