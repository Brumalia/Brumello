"use client";
import React from 'react';
import { StatusBar } from '@/components/design/StatusBar';
import { StatusPanel } from '@/components/design/StatusPanel';

export default function SBPreview() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="min-h-screen bg-brand-bg">
      <StatusBar onOpenDetails={() => setOpen(true)} activeAgents={4} queueDepth={6} costPerHour={0.95} />
      <StatusPanel isOpen={open} onClose={() => setOpen(false)} activeAgents={4} queueDepth={6} costPerHour={0.95} healthStatus="healthy" />
      <main style={{ paddingTop: '64px' }}>
        <div style={{ padding: '24px' }}>
          <h2 className="font-serif text-2xl text-white">Design Shell Preview</h2>
          <p className="font-mono text-sm text-gray-400 mt-2">Click the status bar above to open the panel.</p>
        </div>
      </main>
    </div>
  );
}
