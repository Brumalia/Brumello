'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

/**
 * Mission Control Button Component
 * Phosphor-green accents, sharp edges, DM Mono font
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const baseStyles =
      'font-mono text-sm font-medium px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green';

    const variants = {
      primary:
        'bg-transparent border-b-2 border-brand-green text-white hover:glow-green active:border-brand-green-dim',
      secondary:
        'bg-brand-surface border border-brand-green text-brand-green hover:bg-brand-border hover:glow-green',
      ghost: 'bg-transparent text-foreground border border-brand-border hover:border-brand-green hover:text-brand-green',
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
