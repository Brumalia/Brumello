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
// Health Dot Component with softPulse animation
// ============================================================================

const HealthDot: React.FC<{ status: HealthStatus }> = ({ status }) => {
  const colors = {
    healthy: 'bg-status-active',
    warning: 'bg-status-warning',
    critical: 'bg-status-error',
    offline: 'bg-status-idle',
  };

  const shouldPulse = status !== 'offline';

  return (
    <span
      className={`h-1.5 w-1.5 rounded-full ${colors[status]} ${shouldPulse ? 'animate-[softPulse_2s_ease-in-out_infinite]' : ''}`}
      style={{ animationName: shouldPulse ? 'softPulse' : undefined }}
      title={`System: ${status}`}
    />
  );
};

// ============================================================================
// Status Bar Component
// ============================================================================

/**
 * Mission Control Status Bar
 * - Fixed top bar
 * - Height: 40px
 * - Background: surface
 * - Border-bottom: border-subtle
 * - Status indicators: 5px dots with softPulse animation
 * - Geist 12px, text-muted default / text-secondary for values
 * - Gap: 36px between items
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
      className="fixed top-0 left-0 right-0 h-10 bg-surface border-b border-subtle shadow-sm z-50 flex items-center px-4 gap-9 cursor-pointer hover:bg-card transition-all duration-200 group"
      onClick={onOpenDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenDetails?.()}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-2">
        <span className="font-sans text-xs font-medium text-green-400">⬡ Brumello</span>
      </div>

      {/* Status Signals - Geist Sans 12px, text-muted, gaps 36px */}
      <div className="flex items-center gap-9 font-sans text-xs text-text-muted">
        {/* System Health */}
        <div className="flex items-center gap-2">
          <HealthDot status={healthStatus} />
          <span className="text-text-secondary capitalize">{healthStatus}</span>
        </div>

        {/* Active Agents */}
        <div className="flex items-center gap-2">
          <span>{activeAgents} <span className="text-text-secondary">agents</span></span>
        </div>

        {/* Queue */}
        <div className="flex items-center gap-2">
          <span>{queueDepth} <span className="text-text-secondary">queued</span></span>
        </div>

        {/* Cost */}
        <div className="flex items-center gap-2">
          <span className="text-green-400">£{costPerHour.toFixed(2)}/hr</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Click hint */}
      <div className="font-sans text-xs text-text-muted group-hover:text-green-400 transition-colors duration-200">
        details
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

      {/* Panel - rounded-xl (18px), shadow-lg */}
      <div className="fixed top-2 right-4 w-80 bg-card border border-default rounded-xl z-50 shadow-lg animate-[slideDown_250ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-subtle">
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-medium text-text-primary">System Status</span>
            <HealthDot status={healthStatus} />
          </div>
          <button
            onClick={onClose}
            className="font-sans text-xs text-text-muted hover:text-green-400 transition-colors"
          >
            esc
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Health Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs text-text-muted">Health</span>
              <span className="font-mono text-sm text-text-secondary capitalize">{healthStatus}</span>
            </div>
            <div className="h-1 bg-card-hover rounded-full overflow-hidden">
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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-lg border border-subtle">
              <div className="font-sans text-xs text-text-muted mb-2">Agents</div>
              <div className="font-display text-2xl text-text-heading">{activeAgents}</div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-subtle">
              <div className="font-sans text-xs text-text-muted mb-2">Queue</div>
              <div className="font-display text-2xl text-text-heading">{queueDepth}</div>
            </div>
            <div className="bg-surface p-4 rounded-lg border border-subtle col-span-2">
              <div className="font-sans text-xs text-text-muted mb-2">Cost</div>
              <div className="font-display text-3xl text-green-400">£{costPerHour.toFixed(2)}</div>
              <div className="font-sans text-xs text-text-muted mt-2">per hour</div>
            </div>
          </div>

          {/* Live Feeds */}
          <div className="pt-4 border-t border-subtle space-y-2">
            <div className="font-sans text-xs text-text-muted mb-2">Live Feeds</div>
            <div className="font-mono text-xs text-text-muted">
              › <span className="text-green-400">agent_logs</span>: streaming
            </div>
            <div className="font-mono text-xs text-text-muted">
              › <span className="text-green-400">queue_events</span>: pending
            </div>
            <div className="font-mono text-xs text-text-muted">
              › <span className="text-green-400">cost_tracker</span>: active
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-subtle bg-surface/50 rounded-b-xl">
          <div className="font-sans text-xs text-text-muted">
            Updated: <span className="text-green-400">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// Combined StatusBar with Modal (Default Export)
// ============================================================================

export const StatusBarWithPanel: React.FC<Omit<StatusBarProps, 'onOpenDetails'>> = ({
  activeAgents = 0,
  queueDepth = 0,
  costPerHour = 0,
  healthStatus = 'healthy',
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <StatusBar
        onOpenDetails={() => setIsPanelOpen(true)}
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />
      <StatusPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />
    </>
  );
};

export default StatusBarWithPanel;
