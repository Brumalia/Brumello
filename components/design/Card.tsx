'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
}

/**
 * Mission Control Card Component
 * Softened corners, layered backgrounds, subtle depth
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', elevated = false, children, ...props }, ref) => {
    const baseStyles =
      'border border-border-default bg-bg-card rounded-md p-4 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-border-bright hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2),0_0_20px_rgba(0,232,92,0.1)]';

    const elevatedStyles = elevated
      ? 'shadow-[0_4px_16px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3)]'
      : 'shadow-[0_1px_3px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)]';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${elevatedStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header - Typography hierarchy
 */
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`border-b border-border-default pb-3 mb-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Content
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`text-sm text-text-secondary ${className}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';
