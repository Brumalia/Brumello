'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
}

/**
 * Mission Control Card Component
 * Phosphor-green border, sharp edges, dark background
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', elevated = false, children, ...props }, ref) => {
    const baseStyles =
      'border-2 border-brand-green bg-brand-surface p-4 transition-all duration-200';

    const elevatedStyles = elevated
      ? 'hover:glow-green shadow-lg'
      : 'hover:border-brand-green-dim';

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
      className={`border-b border-brand-border pb-3 mb-3 ${className}`}
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
    <div ref={ref} className={`text-sm text-gray-400 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';
