'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
}

/**
 * Premium Mission Control Card Component
 * - 24px padding (generous spacing)
 * - 14px border-radius (rounded-lg)
 * - Subtle shadow on rest, glow on hover
 * - 250ms transition
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', elevated = false, children, ...props }, ref) => {
    const baseStyles =
      'border border-border-default bg-bg-card rounded-lg p-6 transition-all duration-[250ms] ease-in-out hover:-translate-y-0.5 hover:border-border-bright hover:shadow-glow hover:bg-bg-card-hover';

    const elevatedStyles = elevated
      ? 'shadow-md'
      : 'shadow-sm';

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
      className={`border-b border-border-subtle pb-4 mb-4 ${className}`}
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
    <div ref={ref} className={`text-sm text-text-secondary space-y-4 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = 'CardContent';

/**
 * Card Label - Small title at top
 * Geist Sans 13px, text-muted
 */
interface CardLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardLabel = React.forwardRef<HTMLDivElement, CardLabelProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`font-sans text-sm font-medium text-text-muted mb-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardLabel.displayName = 'CardLabel';

/**
 * Card Value - BIG NUMBER as hero
 * Instrument Serif 36px, text-heading
 */
interface CardValueProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardValue = React.forwardRef<HTMLDivElement, CardValueProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`font-serif text-4xl font-normal text-text-heading mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardValue.displayName = 'CardValue';

/**
 * Card Detail Row - Label + Value pair
 * Geist Sans 12px label + Geist Mono 12px value
 */
interface CardDetailProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
}

export const CardDetail = React.forwardRef<HTMLDivElement, CardDetailProps>(
  ({ className = '', label, value, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex justify-between items-center text-xs ${className}`}
      {...props}
    >
      <span className="font-sans text-text-secondary">{label}</span>
      <span className="font-mono text-text-primary">{value}</span>
    </div>
  )
);

CardDetail.displayName = 'CardDetail';

/**
 * Metric Card - Complete premium card pattern
 * Usage:
 * <MetricCard label="Sales" value="$64,186">
 *   <CardDetail label="Last Year" value="$89,520" />
 *   <CardDetail label="Units Sold" value="4,147" />
 * </MetricCard>
 */
interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ label, value, children, className = '', elevated = false }, ref) => (
    <Card ref={ref} className={className} elevated={elevated}>
      <CardLabel>{label}</CardLabel>
      <CardValue>{value}</CardValue>
      {children && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </Card>
  )
);

MetricCard.displayName = 'MetricCard';
