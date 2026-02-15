'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'active' | 'done' | 'warning' | 'error' | 'info' | 'idle';
  children: React.ReactNode;
}

/**
 * Premium Mission Control Badge Component
 * - 6px border-radius (rounded-sm)
 * - Emerald palette for active/done states
 * - Muted backgrounds with bright text
 * - Geist Sans for labels (not mono)
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    const baseStyles =
      'font-sans text-xs font-medium px-2.5 py-1 inline-block rounded-sm transition-colors duration-200';

    const variants = {
      default:
        'bg-bg-card text-text-secondary border border-border-default',
      active:
        'bg-[rgba(52,211,153,0.12)] text-status-active border-0',
      done:
        'bg-[rgba(52,211,153,0.12)] text-status-active border-0',
      warning:
        'bg-[rgba(251,191,36,0.12)] text-status-warning border-0',
      error:
        'bg-[rgba(248,113,113,0.12)] text-status-error border-0',
      info:
        'bg-[rgba(96,165,250,0.12)] text-status-info border-0',
      idle:
        'bg-[rgba(255,255,255,0.05)] text-text-muted border-0',
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
