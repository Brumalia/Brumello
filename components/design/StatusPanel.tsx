"use client";
import React from 'react';

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';

export interface StatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeAgents?: number;
  queueDepth?: number;
  costPerHour?: number;
  healthStatus?: HealthStatus;
}

/**
 * Premium Mission Control Status Panel
 * - bg-card with rounded-xl (18px)
 * - shadow-lg
 * - inset margin 8px 16px
 * - Geist Sans 12px text-muted throughout
 */
export const StatusPanel: React.FC<StatusPanelProps> = ({
  isOpen,
  onClose,
  activeAgents = 0,
  queueDepth = 0,
  costPerHour = 0,
  healthStatus = 'healthy'
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Status Panel"
      className="fixed top-[8px] right-[16px] h-auto w-80 bg-bg-card border border-border-default rounded-xl shadow-lg z-50 p-6"
    >
      <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-4">
        <strong className="font-sans text-sm font-medium text-text-primary">Status Panel</strong>
        <button
          onClick={onClose}
          className="font-sans text-xs text-text-muted hover:text-brand-green transition-colors"
        >
          Close
        </button>
      </div>
      <div className="space-y-4 font-sans text-sm text-text-secondary">
        <div className="flex justify-between">
          <span className="text-text-muted">Active Agents:</span>
          <span className="font-mono text-text-primary">{activeAgents}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Queue Depth:</span>
          <span className="font-mono text-text-primary">{queueDepth}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Cost/hr:</span>
          <span className="font-mono text-brand-green">£{costPerHour.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-muted">Health:</span>
          <span className="font-mono text-text-primary capitalize">{healthStatus}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
