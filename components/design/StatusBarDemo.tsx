/**
 * StatusBar Demo Page
 * 
 * Demonstrates StatusBar placement in the Brumello app shell
 * with sample data and interaction handlers.
 * 
 * Usage:
 * - Copy this snippet into your app layout or page
 * - Replace placeholder data with real state (Zustand, Context, etc.)
 * - Wire up the live data feeds as indicated in comments
 */

"use client";

import React, { useState, useEffect } from 'react';
import { StatusBar, StatusPanel, StatusBarWithPanel, StatusBarProps, HealthStatus } from './StatusBar';

// ============================================================================
// Demo: Standalone StatusBar + Panel (controlled)
// ============================================================================

export const StatusBarDemoControlled: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // TODO: Wire these to your real data sources
  const [activeAgents, setActiveAgents] = useState(3);
  const [queueDepth, setQueueDepth] = useState(12);
  const [costPerHour, setCostPerHour] = useState(2.45);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('healthy');

  // Simulated live updates (replace with real WebSocket/polling)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgents(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      setQueueDepth(prev => Math.max(0, prev + Math.floor(Math.random() * 5) - 2));
      setCostPerHour(prev => Math.max(0, prev + (Math.random() * 0.5 - 0.25)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Status Bar - fixed at top */}
      <StatusBar
        onOpenDetails={() => setIsPanelOpen(true)}
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />

      {/* Status Panel - rendered conditionally */}
      <StatusPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />

      {/* Main Content Area */}
      <main className="pt-14 p-6">
        <h1 className="font-serif text-3xl text-white mb-4">Mission Control</h1>
        <p className="font-mono text-gray-500 text-sm">
          Click the status bar above to open the detailed panel.
        </p>
        
        {/* Your board/list content goes here */}
        <div className="mt-8 p-4 border border-brand-border bg-brand-surface">
          <span className="font-mono text-xs text-gray-500">
            // MAIN_CONTENT_AREA
          </span>
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// Demo: Integrated StatusBar with Panel (self-contained)
// ============================================================================

export const StatusBarDemoIntegrated: React.FC = () => {
  // Use this version for simple drop-in - handles panel state internally
  
  const [activeAgents] = useState(3);
  const [queueDepth] = useState(12);
  const [costPerHour] = useState(2.45);
  const [healthStatus] = useState<HealthStatus>('healthy');

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Single component - handles everything */}
      <StatusBarWithPanel
        activeAgents={activeAgents}
        queueDepth={queueDepth}
        costPerHour={costPerHour}
        healthStatus={healthStatus}
      />

      <main className="pt-14 p-6">
        <h1 className="font-serif text-3xl text-white mb-4">Mission Control</h1>
        <p className="font-mono text-gray-500 text-sm">
          Click the status bar to see the integrated panel.
        </p>
      </main>
    </div>
  );
};

// ============================================================================
// Usage in App Shell Layout
// ============================================================================

/**
 * INTEGRATION EXAMPLE - Copy to your app layout
 * 
 * ```tsx
 * // app/layout.tsx or app/shell.tsx
 * 
 * import { StatusBar, StatusPanel } from './components/design/StatusBar';
 * import { useAppStore } from './store'; // your state management
 * 
 * export default function AppShell({ children }) {
 *   const [isStatusOpen, setIsStatusOpen] = useState(false);
 *   
 *   // Connect to your real data:
 *   const activeAgents = useAppStore(s => s.agents.activeCount);
 *   const queueDepth = useAppStore(s => s.queue.length);
 *   const costPerHour = useAppStore(s => s.billing.currentRate);
 *   const healthStatus = useAppStore(s => s.system.health);
 * 
 *   return (
 *     <div className="min-h-screen bg-brand-bg">
 *       <StatusBar
 *         onOpenDetails={() => setIsStatusOpen(true)}
 *         activeAgents={activeAgents}
 *         queueDepth={queueDepth}
 *         costPerHour={costPerHour}
 *         healthStatus={healthStatus}
 *       />
 *       
 *       <StatusPanel
 *         isOpen={isStatusOpen}
 *         onClose={() => setIsStatusOpen(false)}
 *         activeAgents={activeAgents}
 *         queueDepth={queueDepth}
 *         costPerHour={costPerHour}
 *         healthStatus={healthStatus}
 *       />
 *       
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================================================
// Props Reference
// ============================================================================

/**
 * StatusBar Props:
 * @param onOpenDetails - Callback when bar is clicked
 * @param activeAgents - Number of active agents (default: 0)
 * @param queueDepth - Number of items in queue (default: 0)
 * @param costPerHour - Cost per hour in GBP (default: 0)
 * @param healthStatus - System health: 'healthy' | 'warning' | 'critical' | 'offline'
 * 
 * StatusPanel Props:
 * @param isOpen - Whether panel is visible
 * @param onClose - Callback to close panel
 * @param activeAgents - Shown in panel stats
 * @param queueDepth - Shown in panel stats
 * @param costPerHour - Shown in panel stats
 * @param healthStatus - Shown in panel health indicator
 */

export default StatusBarDemoControlled;
