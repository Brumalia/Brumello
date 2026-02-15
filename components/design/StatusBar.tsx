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
    healthy: 'bg-brand-green',
    warning: 'bg-brand-amber',
    critical: 'bg-red-500',
    offline: 'bg-gray-500',
  };

  const pulse = {
    healthy: 'animate-pulse',
    warning: 'animate-pulse',
    critical: 'animate-pulse',
    offline: '',
  };

  return (
    <span
      className={`h-2.5 w-2.5 rounded-full ${colors[status]} ${pulse[status]} shadow-[0_0_8px_currentColor]`}
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
      className="fixed top-0 left-0 right-0 h-12 bg-brand-bg border-b border-brand-border z-50 flex items-center px-4 gap-6 cursor-pointer hover:border-brand-green/50 transition-colors duration-200 group"
      onClick={onOpenDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenDetails?.()}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-brand-green tracking-wider">⬡ BRUMELLO</span>
        <span className="font-mono text-xs text-brand-border">//</span>
        <span className="font-mono text-xs text-gray-500 tracking-wider">MISSION_CTRL</span>
      </div>

      {/* Divider */}
      <div className="h-4 w-px bg-brand-border" />

      {/* Status Signals */}
      <div className="flex items-center gap-6">
        {/* Active Agents */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-500">AGENTS</span>
          <span className="font-mono text-sm text-white">{activeAgents}</span>
        </div>

        {/* Queue Depth */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-500">QUEUE</span>
          <span className="font-mono text-sm text-white">{queueDepth}</span>
        </div>

        {/* Cost/hr */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gray-500">COST/HR</span>
          <span className="font-mono text-sm text-brand-green">£{costPerHour.toFixed(2)}</span>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Health Indicator */}
      <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
        <HealthDot status={healthStatus} />
        <span className="font-mono text-xs text-gray-500 uppercase">{healthStatus}</span>
      </div>

      {/* Click hint */}
      <div className="font-mono text-xs text-gray-600 group-hover:text-brand-green transition-colors duration-200">
        [CLICK]
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

      {/* Panel */}
      <div className="fixed top-14 right-4 w-80 bg-brand-surface border border-brand-border z-50 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-brand-green tracking-wider">SYSTEM_STATUS</span>
            <div className="h-1 w-1 rounded-full bg-brand-green animate-pulse" />
          </div>
          <button
            onClick={onClose}
            className="font-mono text-xs text-gray-500 hover:text-brand-green transition-colors"
          >
            [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Health Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gray-500">SYSTEM_HEALTH</span>
              <div className="flex items-center gap-2">
                <HealthDot status={healthStatus} />
                <span className="font-mono text-sm text-white uppercase">{healthStatus}</span>
              </div>
            </div>
            <div className="h-1 bg-brand-border">
              <div
                className={`h-full transition-all duration-500 ${
                  healthStatus === 'healthy'
                    ? 'bg-brand-green w-full'
                    : healthStatus === 'warning'
                      ? 'bg-brand-amber w-2/3'
                      : healthStatus === 'critical'
                        ? 'bg-red-500 w-1/3'
                        : 'bg-gray-500 w-0'
                }`}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-brand-bg p-3 border border-brand-border">
              <div className="font-mono text-xs text-gray-500 mb-1">ACTIVE_AGENTS</div>
              <div className="font-mono text-xl text-white">{activeAgents}</div>
            </div>
            <div className="bg-brand-bg p-3 border border-brand-border">
              <div className="font-mono text-xs text-gray-500 mb-1">QUEUE_DEPTH</div>
              <div className="font-mono text-xl text-white">{queueDepth}</div>
            </div>
            <div className="bg-brand-bg p-3 border border-brand-border col-span-2">
              <div className="font-mono text-xs text-gray-500 mb-1">CURRENT_COST</div>
              <div className="font-mono text-2xl text-brand-green">£{costPerHour.toFixed(2)}</div>
              <div className="font-mono text-xs text-gray-600 mt-1">per hour</div>
            </div>
          </div>

          {/* Live Placeholders (to be wired) */}
          <div className="pt-2 border-t border-brand-border space-y-2">
            <div className="font-mono text-xs text-gray-600 uppercase tracking-wider mb-2">
              _live_feeds_placeholder
            </div>
            <div className="font-mono text-xs text-gray-500">
              › <span className="text-brand-green">agent_logs</span>: streaming...
            </div>
            <div className="font-mono text-xs text-gray-500">
              › <span className="text-brand-green">queue_events</span>: pending
            </div>
            <div className="font-mono text-xs text-gray-500">
              › <span className="text-brand-green">cost_tracker</span>: active
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-brand-border bg-brand-bg/50">
          <div className="font-mono text-xs text-gray-600">
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
