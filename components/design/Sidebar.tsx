'use client';

import React from 'react';

interface SidebarItemProps {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}

/**
 * Sidebar Item - Architectural frame
 * - Background: surface
 * - No border-radius (flush edge on left)
 * - Items: rounded on right only (0 10px 10px 0)
 * - Hover: green-50 bg
 * - Active: green-100 bg + green-400 text
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon = '•',
  active = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 font-sans text-sm
        transition-all duration-200
        ${active 
          ? 'bg-green-100 text-green-400 font-medium rounded-r-md' 
          : 'text-text-secondary hover:bg-green-50 hover:text-text-primary rounded-r-md'
        }
      `}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
};

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Sidebar - Architectural frame
 * - Background: surface
 * - No border-radius (flush edge)
 * - Fixed width for demo
 */
export const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-surface border-r border-subtle ${className}`}>
      <div className="p-4 border-b border-subtle">
        <div className="font-sans text-sm font-semibold text-green-400">Navigation</div>
      </div>
      <nav className="py-2">
        {children}
      </nav>
    </div>
  );
};
