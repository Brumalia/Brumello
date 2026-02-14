'use client';

import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

/**
 * Mission Control Spinner
 * Phosphor-green rotating border with optional pulse
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', pulse = false }, ref) => {
    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    };

    return (
      <div ref={ref} className="flex items-center justify-center">
        <div
          className={`${sizeStyles[size]} ${pulse ? 'spinner-pulse' : 'spinner'}`}
        />
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
