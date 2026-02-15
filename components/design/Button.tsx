'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

/**
 * Premium Mission Control Button Component
 * - Primary: emerald-400 bg, emerald-500 hover + lift + glow
 * - Secondary: bg-card + border, bg-card-hover on hover
 * - Ghost: transparent, subtle green hover
 * - 10px border-radius (rounded-md)
 * - Geist Sans 13px, font-semibold
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const baseStyles =
      'font-sans text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green/30 tracking-tight';

    const variants = {
      primary:
        'bg-brand-green text-bg-base hover:bg-brand-green-dim hover:-translate-y-0.5 hover:shadow-glow active:translate-y-0',
      secondary:
        'bg-bg-card border border-border-default text-text-primary hover:bg-bg-card-hover hover:border-border-bright hover:-translate-y-0.5',
      ghost:
        'bg-transparent text-text-muted hover:bg-green-50 hover:text-text-secondary',
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
