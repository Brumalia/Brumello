"use client";

import React, { useState } from 'react';

// ============================================================================
// Types
// ============================================================================

export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';

export interface StatusBarProps {
  /** Callback when status bar is clicked */
  onOpenDetails?: () => void;
  /** Number of currently active agents */
  activeAgents?: number;
  /** Number of items in queue */
  queueDepth?: number;
  /** Current cost per hour in GBP */
  costPerHour?: number;
  /** Health status of the system */
  healthStatus?: HealthStatus;
  /** Whether the panel is externally controlled */
  isPanelOpen?: boolean;
  /** Callback to close panel from parent */
  onClosePanel?: () => void;
}

export interface StatusPanelProps {
  /** Whether the panel is open */
  isOpen: boolean;
  /** Callback to close the panel */
  onClose: () => void;
  /** Current active agents count */
  activeAgents?: number;
  /** Current queue depth */
  queueDepth?: number;
  /** Current cost per hour */
  costPerHour?: number;
  /** System health status */
  healthStatus?: HealthStatus;
}

// ============================================================================
// Health Dot Component
// ============================================================================

const HealthDot: React.FC<{ status: HealthStatus }> = ({ status }) => {
  const colors = {
    healthy: 'bg-status-active',
    warning: 'bg-status-warning',
    critical: 'bg-status-error',
    offline: 'bg-status-idle',
  };

  const pulse = {
    healthy: 'animate-pulse',
    warning: 'animate-pulse',
    critical: 'animate-pulse',
    offline: '',
  };

  return (
    <span
      className={`h-1.5 w-1.5 rounded-full ${colors[status]} ${pulse[status]} shadow-[0_0_6px_currentColor]`}
      title={`System: ${status}`}
    />
  );
};

// ============================================================================
// Status Bar Component
// ============================================================================

/**
 * Mission Control Status Bar
 * Fixed top bar showing active agents, queue depth, cost/hr, and health
 * Click to open detailed status panel
 */
export const StatusBar: React.FC<StatusBarProps> = ({
  onOpenDetails,
  activeAgents = 0,
  queueDepth = 0,
  costPerHour = 0,
  healthStatus = 'healthy',
}) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 h-10 bg-bg-surface border-b border-border-subtle shadow-sm z-50 flex items-center px-4 gap-8 cursor-pointer hover:bg-bg-card transition-all duration-200 group"
      onClick={onOpenDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenDetails?.()}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-2">
        <span className="font-sans text-xs font-medium text-brand-green">⬡ Brumello</span>
      </div>

      {/* Status Signals - Geist Sans 12px, text-muted, generous gaps (32px) */}
      <div className="flex items-center gap-8 font-sans text-xs text-text-muted">
        {/* System Health */}
        <div className="flex items-center gap-2">
          <HealthDot status={healthStatus} />
          <span>System {healthStatus}</span>
        </div>

        {/* Active Agents */}
        <div className="flex items-center gap-2">
          <span>{activeAgents} agent{activeAgents !== 1 ? 's' : ''} active</span>
        </div>

        {/* Queue */}
        <div className="flex items-center gap-2">
          <span>{queueDepth} in queue</span>
        </div>

        {/* Cost */}
        <div className="flex items-center gap-2">
          <span className="text-brand-green">£{costPerHour.toFixed(2)}/hr</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Click hint */}
      <div className="font-sans text-xs text-text-muted group-hover:text-brand-green transition-colors duration-200">
        click for details
      </div>
    </div>
  );
};

// ============================================================================
// Status Panel (Modal/Drawer) Component
// ============================================================================

/**
 * Mission Control Status Panel
 * Modal/drawer showing detailed system status
 */
export const StatusPanel: React.FC<StatusPanelProps> = ({
  isOpen,
  onClose,
  activeAgents = 0,
  queueDepth = 0,
  costPerHour = 0,
  healthStatus = 'healthy',
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel - rounded-xl (18px), shadow-lg, inset margin 8px 16px */}
      <div className="fixed top-[8px] right-[16px] w-80 bg-bg-card border border-border-default rounded-xl z-50 shadow-lg animate-[slideDown_250ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-medium text-text-primary">System Status</span>
            <div className="h-1 w-1 rounded-full bg-brand-green animate-pulse" />
          </div>
          <button
            onClick={onClose}
            className="font-sans text-xs text-text-muted hover:text-brand-green transition-colors"
          >
            esc
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Health Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-text-muted">System Health</span>
              <div className="flex items-center gap-2">
                <HealthDot status={healthStatus} />
                <span className="font-mono text-sm text-text-primary capitalize">{healthStatus}</span>
              </div>
            </div>
            <div className="h-1 bg-bg-card-hover rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  healthStatus === 'healthy'
                    ? 'bg-status-active w-full'
                    : healthStatus === 'warning'
                      ? 'bg-status-warning w-2/3'
                      : healthStatus === 'critical'
                        ? 'bg-status-error w-1/3'
                        : 'bg-status-idle w-0'
                }`}
              />
            </div>
          </div>

          {/* Stats Grid - 16px gaps between cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-bg-surface p-4 rounded-lg border border-border-subtle">
              <div className="font-sans text-xs text-text-muted mb-2">Active Agents</div>
              <div className="font-serif text-2xl text-text-heading">{activeAgents}</div>
            </div>
            <div className="bg-bg-surface p-4 rounded-lg border border-border-subtle">
              <div className="font-sans text-xs text-text-muted mb-2">Queue Depth</div>
              <div className="font-serif text-2xl text-text-heading">{queueDepth}</div>
            </div>
            <div className="bg-bg-surface p-4 rounded-lg border border-border-subtle col-span-2">
              <div className="font-sans text-xs text-text-muted mb-2">Current Cost</div>
              <div className="font-serif text-3xl text-brand-green">£{costPerHour.toFixed(2)}</div>
              <div className="font-sans text-xs text-text-muted mt-2">per hour</div>
            </div>
          </div>

          {/* Live Placeholders (to be wired) */}
          <div className="pt-4 border-t border-border-subtle space-y-2">
            <div className="font-sans text-xs text-text-muted uppercase tracking-wider mb-2">
              Live Feeds
            </div>
            <div className="font-mono text-xs text-text-muted">
              › <span className="text-brand-green">agent_logs</span>: streaming...
            </div>
            <div className="font-mono text-xs text-text-muted">
              › <span className="text-brand-green">queue_events</span>: pending
            </div>
            <div className="font-mono text-xs text-text-muted">
              › <span className="text-brand-green">cost_tracker</span>: active
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border-subtle bg-bg-surface/50">
          <div className="font-sans text-xs text-text-muted">
            Last updated: <span className="text-brand-green">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// Combined StatusBar with Modal (Default Export)
// ============================================================================

/**
 * StatusBar with integrated modal panel
 * Use this for simple drop-in usage
 */
export const StatusBarWithPanel: React.FC<Omit<StatusBarProps, 'isPanelOpen' | 'onClosePanel'>> = ({
  onOpenDetails,
  activeAgents = 0,
  queueDepth = 0,
  costPerHour = 0,
  healthStatus = 'healthy',
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpen = () => {
    setIsPanelOpen(true);
    onOpenDetails?.();
  };

  const handleClose = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      <StatusBar
        onOpenDetails={handleOpen}
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />
      <StatusPanel
        isOpen={isPanelOpen}
        onClose={handleClose}
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />
    </>
  );
};

export default StatusBarWithPanel;
