'use client';

import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'active' | 'pending' | 'blocked' | 'review' | 'idle' | 'research' | 'agent' | 'infra' | 'eval';
  children: React.ReactNode;
}

/**
 * Premium Mission Control Badge Component
 * - Size: 11px, weight 500, padding 4px 10px, radius-sm
 * - Sentence case (no uppercase)
 * - Colors: active, pending, blocked, review, idle, research, agent, infra, eval
 * - Use Geist font
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'idle', className = '', children, ...props }, ref) => {
    const baseStyles =
      'font-sans text-xs font-medium px-2.5 py-1 inline-block rounded-sm transition-colors duration-200';

    const variants = {
      active: 'bg-green-100 text-status-active',
      pending: 'bg-[rgba(251,191,36,0.10)] text-status-warning',
      blocked: 'bg-[rgba(248,113,113,0.10)] text-status-error',
      review: 'bg-[rgba(96,165,250,0.10)] text-status-info',
      idle: 'bg-[rgba(255,255,255,0.05)] text-text-muted',
      research: 'bg-green-50 text-green-400',
      agent: 'bg-green-100 text-status-active',
      infra: 'bg-[rgba(96,165,250,0.10)] text-status-info',
      eval: 'bg-[rgba(251,191,36,0.10)] text-status-warning',
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
