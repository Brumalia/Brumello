import React from 'react';
import { StatusBar } from '@/components/design/StatusBar';
import { StatusPanel } from '@/components/design/StatusPanel';

export default function SBPreview(){
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <StatusBar onOpenDetails={() => setOpen(true)} activeAgents={4} queueDepth={6} costPerHour={0.95} />
      <StatusPanel open={open} onClose={() => setOpen(false)} data={{ activeAgents:4, queueDepth:6, costs:{hourly:0.95, totalToday: 20.5}, lastUpdated: new Date().toISOString() }} />
      <main style={{ paddingTop: '64px' }}>
        <div style={{ padding: '24px' }}>
          <h2>Design Shell Preview</h2>
          <p>This page demonstrates the Status Bar in the app shell with a placeholder Status Panel.</p>
        </div>
      </main>
    </div>
  );
}
