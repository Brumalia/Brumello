'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

/**
 * Mission Control Badge Component
 * Geist Mono for data-like content, softened colors, 4px corners
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles =
      'font-mono text-xs font-medium px-2 py-0.5 inline-block rounded transition-colors duration-200 tracking-wide';

    const variants = {
      default:
        'bg-bg-card text-text-secondary border border-border-bright',
      success:
        'bg-brand-green/10 text-brand-green border border-brand-green/20',
      warning:
        'bg-brand-amber/10 text-brand-amber border border-brand-amber/20',
      error:
        'bg-brand-red/10 text-brand-red border border-brand-red/20',
      info: 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
