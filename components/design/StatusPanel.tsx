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

// Minimal placeholder panel for preview routes
export const StatusPanel: React.FC<StatusPanelProps> = ({ isOpen, onClose, activeAgents = 0, queueDepth = 0, costPerHour = 0, healthStatus = 'healthy' }) => {
  if (!isOpen) return null;
  return (
    <div role="dialog" aria-label="Status Panel" className="fixed right-0 top-0 h-full w-72 bg-brand-surface border-l border-brand-border z-50 p-4">
      <div className="flex items-center justify-between border-b border-brand-border pb-2 mb-2">
        <strong className="font-mono text-sm text-brand-green">Status Panel</strong>
        <button onClick={onClose} className="text-xs text-gray-300">Close</button>
      </div>
      <div className="space-y-3 text-sm text-gray-100">
        <div>Active: {activeAgents}</div>
        <div>Queue: {queueDepth}</div>
        <div>Cost/hr: £{costPerHour.toFixed(2)}</div>
        <div>Health: {healthStatus}</div>
      </div>
    </div>
  );
};

export default StatusPanel;
