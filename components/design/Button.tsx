'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

/**
 * Premium Mission Control Button Component
 * - Primary: green-400 bg, green-500 hover, shadow + lift
 * - Secondary: card bg, border-default, hover: card-hover
 * - Ghost: transparent, text-muted, hover: green-50
 * - All: Geist 13px weight-600, 10px 20px padding, md radius
 * - Transitions: 250ms ease
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const baseStyles =
      'font-sans text-sm font-semibold px-5 py-2.5 rounded-md transition-all duration-[250ms] ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400/30';

    const variants = {
      primary:
        'bg-green-400 text-base hover:bg-green-500 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0',
      secondary:
        'bg-card border border-default text-text-primary hover:bg-card-hover hover:border-bright hover:-translate-y-0.5 hover:shadow-sm',
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
