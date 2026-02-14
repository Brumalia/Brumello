'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
}

/**
 * Mission Control Badge Component
 * Monospaced, semantic color variants
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles =
      'font-mono text-xs font-medium px-2 py-1 inline-block transition-colors duration-200';

    const variants = {
      default:
        'bg-brand-border text-foreground border border-brand-green/30 hover:border-brand-green/60 hover:text-glow',
      success:
        'bg-green-900/30 text-green-300 border border-green-500/50 hover:border-green-400 success-state',
      warning:
        'bg-yellow-900/30 text-yellow-300 border border-yellow-500/50 hover:border-yellow-400',
      error:
        'bg-red-900/30 text-red-300 border border-red-500/50 hover:border-red-400',
      info: 'bg-cyan-900/30 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400',
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
